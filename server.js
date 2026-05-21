const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'gris123';

const sessions = new Set();

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname)));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Kun billedfiler er tilladt'));
  }
});

function requireAuth(req, res, next) {
  const token = req.cookies.admin_token;
  if (token && sessions.has(token)) return next();
  res.status(401).json({ error: 'Ikke autoriseret' });
}

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = crypto.randomBytes(32).toString('hex');
    sessions.add(token);
    res.cookie('admin_token', token, { httpOnly: true, maxAge: 8 * 60 * 60 * 1000 });
    res.json({ ok: true });
  } else {
    res.status(401).json({ error: 'Forkert kodeord' });
  }
});

app.post('/api/logout', (req, res) => {
  sessions.delete(req.cookies.admin_token);
  res.clearCookie('admin_token');
  res.json({ ok: true });
});

app.get('/api/indhold', (req, res) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'indhold.json'), 'utf-8');
    res.json(JSON.parse(data));
  } catch {
    res.status(500).json({ error: 'Kunne ikke læse indhold' });
  }
});

app.post('/api/indhold', requireAuth, (req, res) => {
  try {
    fs.writeFileSync(path.join(__dirname, 'indhold.json'), JSON.stringify(req.body, null, 2));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Kunne ikke gemme indhold' });
  }
});

app.post('/api/upload', requireAuth, upload.single('billede'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Ingen fil modtaget' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

app.listen(PORT, () => {
  console.log(`\n🍕 Pizza-skabelon kører på http://localhost:${PORT}`);
  console.log(`🔐 Admin-panel: http://localhost:${PORT}/admin.html`);
  console.log(`   Kodeord: ${ADMIN_PASSWORD}\n`);
});
