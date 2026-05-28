let menuRenderedFromCache = false;

const tagLabels = {
  popular: 'Mest populær',
  hot:     'Favorit',
  new:     'Nyhed',
  veg:     'Vegetar'
};

const tagClasses = {
  popular: 'tag-popular',
  hot:     'tag-popular',
  new:     'tag-new',
  veg:     'tag-veg'
};

function get(obj, path) {
  return path.split('.').reduce((o, k) => o?.[k], obj);
}

function formatPrice(pris) {
  if (!pris || pris === 0) return 'Kontakt for pris';
  return pris.toLocaleString('da-DK') + ' kr.';
}

function applyContent(data) {
  document.querySelectorAll('[data-content]').forEach(el => {
    const val = get(data, el.dataset.content);
    if (val !== undefined) {
      el.textContent = val;
    }
  });

  document.querySelectorAll('[data-src]').forEach(el => {
    const val = get(data, el.dataset.src);
    if (val) el.src = val;
  });

  document.querySelectorAll('.hero-content').forEach(el => {
    el.style.opacity = '1';
  });
}

async function loadContent() {
  let data;
  try {
    const res = await fetch('/api/indhold');
    data = await res.json();
    sessionStorage.setItem('siteContent', JSON.stringify(data));
  } catch {
    return;
  }

  applyContent(data);

  // Forsidespecialiteter
  const specialtiesGrid = document.getElementById('specialties-grid');
  if (specialtiesGrid && data.menu) {
    const favIds = data.restaurant?.favoritter_ids;
    let items;
    if (favIds && favIds.length > 0) {
      items = favIds.map(id => data.menu.find(i => i.id === id)).filter(Boolean);
    } else {
      const featured = data.menu.filter(i => i.tag === 'popular' || i.tag === 'hot').slice(0, 3);
      items = featured.length >= 3 ? featured : data.menu.slice(0, 3);
    }
    const fallbackImg = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop';
    specialtiesGrid.innerHTML = items.map(item => `
      <div class="specialty-card fade-up">
        <div class="specialty-img-wrap"><img src="${item.billede || fallbackImg}" alt="${item.navn}" ${item.billede_style ? `style="${item.billede_style}"` : ''} /></div>
        <div class="specialty-info">
          <h3>${item.navn}</h3>
          <p>${item.beskrivelse}</p>
          <div class="specialty-price">
            <span class="price">${formatPrice(item.pris)}</span>
            <a href="menu.html" class="btn btn-primary" style="padding:0.5rem 1.2rem;font-size:0.82rem;">Se pakker</a>
          </div>
        </div>
      </div>
    `).join('');
    observeFadeUps();
  }

  // Fjern overlay ved første besøg
  const overlay = document.getElementById('page-overlay');
  if (overlay && overlay.style.display !== 'none') {
    sessionStorage.setItem('visited', '1');
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.remove(), 500);
  } else if (overlay) {
    overlay.remove();
  }

  // Tilbud-sektion
  const tilbudEl = document.getElementById('tilbud-sektion');
  if (tilbudEl && data.tilbud?.aktiv) {
    tilbudEl.style.display = 'block';
    tilbudEl.innerHTML = `
      <section class="section section-alt">
        <div class="about-grid fade-up" style="align-items:center;">
          ${data.tilbud.billede ? `<div class="about-image fade-up"><img src="${data.tilbud.billede}" alt="${data.tilbud.titel}" /></div>` : ''}
          <div class="fade-up" ${!data.tilbud.billede ? 'style="grid-column:1/-1;text-align:center;max-width:700px;margin:0 auto;"' : ''}>
            <span class="section-label">Lige nu</span>
            <h2 class="section-title">${data.tilbud.titel}</h2>
            ${data.tilbud.tekst ? `<p style="color:var(--text-mid);line-height:1.8;margin-bottom:1.5rem;">${data.tilbud.tekst}</p>` : ''}
            ${data.tilbud.pris ? `<div style="font-size:2rem;font-weight:800;color:var(--amber-light);margin-bottom:1.5rem;">${formatPrice(data.tilbud.pris)}</div>` : ''}
            <a href="menu.html" class="btn btn-primary">Se alle pakker</a>
          </div>
        </div>
      </section>`;
    observeFadeUps();
  } else if (tilbudEl) {
    tilbudEl.style.display = 'none';
  }

  // ── FORSIDE DYNAMISK INDHOLD ──
  const f = data.forside || {};
  const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
  const featureIcons = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>`
  ];

  // Hero baggrundsbillede
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && data.restaurant?.hero_billede) {
    heroBg.style.backgroundImage = `url('${data.restaurant.hero_billede}')`;
  }

  // Om os-billede
  const omOsImg = document.getElementById('om-os-img');
  if (omOsImg && data.restaurant?.om_os_billede) {
    omOsImg.src = data.restaurant.om_os_billede;
  }

  // Hero h1
  const h1l1 = document.getElementById('hero-h1-line1');
  if (h1l1 && f.hero_h1_normal !== undefined) {
    h1l1.innerHTML = f.hero_h1_normal + (f.hero_h1_kursiv ? ' <em>' + f.hero_h1_kursiv + '</em>' : '');
  }
  const h1l2 = document.getElementById('hero-h1-line2');
  if (h1l2 && f.hero_h1_linje2 !== undefined) h1l2.textContent = f.hero_h1_linje2;

  // Hero knapper
  const k1 = document.getElementById('hero-knap1');
  if (k1) { if (f.knap1_tekst) k1.textContent = f.knap1_tekst; if (f.knap1_link) k1.href = f.knap1_link; }
  const k2 = document.getElementById('hero-knap2');
  if (k2) { if (f.knap2_tekst) k2.textContent = f.knap2_tekst; if (f.knap2_link) k2.href = f.knap2_link; }

  // Specialiteter undertekst + knap
  const specSub = document.getElementById('specialiteter-sub');
  if (specSub && f.specialiteter_sub) specSub.textContent = f.specialiteter_sub;
  const specKnap = document.getElementById('specialiteter-knap');
  if (specKnap && f.specialiteter_knap_tekst) specKnap.textContent = f.specialiteter_knap_tekst;

  // Events overskrift
  const evH2 = document.getElementById('events-h2');
  if (evH2 && f.events_titel_normal !== undefined) {
    evH2.innerHTML = f.events_titel_normal + (f.events_titel_kursiv ? ` <em style="font-style:italic;color:var(--amber-light);">${f.events_titel_kursiv}</em>` : '');
  }
  // Events undertekst + knap
  const evSub = document.getElementById('events-sub');
  if (evSub && f.events_sub) evSub.textContent = f.events_sub;
  const evKnap = document.getElementById('events-knap');
  if (evKnap) { if (f.events_knap_tekst) evKnap.textContent = f.events_knap_tekst; if (f.events_knap_link) evKnap.href = f.events_knap_link; }

  // Events checkliste
  const evList = document.getElementById('events-checklist');
  if (evList && f.events_checklist?.length) {
    evList.innerHTML = f.events_checklist.map(item =>
      `<li><span class="events-check">${checkSvg}</span>${item}</li>`
    ).join('');
  }

  // Om os features
  const featEl = document.getElementById('features-list');
  if (featEl && f.features?.length) {
    featEl.innerHTML = f.features.map((feat, i) => `
      <div class="feature">
        <div class="feature-icon">${featureIcons[i % featureIcons.length]}</div>
        <div class="feature-text"><h4>${feat.titel}</h4><p>${feat.tekst}</p></div>
      </div>`).join('');
  }

  // Galleri
  const galleriEl = document.getElementById('events-galleri');
  if (galleriEl && f.galleri?.length) {
    galleriEl.innerHTML = f.galleri.map((src, i) =>
      `<div class="events-photo"><img src="${src}" alt="Arrangement ${i + 1}" onclick="openLightbox(this)" /></div>`
    ).join('');
  }

  if (!menuRenderedFromCache) {
    renderMenuPage(data);
  }
  menuRenderedFromCache = false;

  // Åbningstider på forsiden
  const hoursGrid = document.getElementById('hours-grid');
  if (hoursGrid && data.aabningstider) {
    hoursGrid.innerHTML = data.aabningstider.map(h => `
      <div class="hours-card">
        <div class="hours-day">${h.dage}</div>
        <div class="hours-time">${h.tid}</div>
      </div>
    `).join('');
  }

  observeFadeUps();
}

function renderMenuPage(data) {
  if (!data.menu) return;
  const menuContainer = document.getElementById('menu-container');
  const menuFilters   = document.getElementById('menu-filters');
  if (!menuContainer || !menuFilters) return;

  const categories = data.kategorier || [];

  menuFilters.innerHTML =
    `<button class="filter-btn active" onclick="filterMenu('all', this)">Alle</button>` +
    categories.map(({ key, label }) =>
      `<button class="filter-btn" onclick="filterMenu('${key}', this)">${label}</button>`
    ).join('');

  menuContainer.innerHTML = categories.map(({ key, label }, idx) => {
    const items = data.menu.filter(i => i.kategori === key);
    if (!items.length) return '';
    const cards = items.map(item => {
      if (item.type === 'info') {
        return `<div class="menu-info-banner fade-up">${item.tekst}</div>`;
      }
      const menuBillede = item.billede_menu && item.billede_menu.trim() !== '' ? item.billede_menu : item.billede;
      const hasImage = menuBillede && menuBillede.trim() !== '';
      const tagHtml  = item.tag && tagLabels[item.tag]
        ? `<span class="menu-tag ${tagClasses[item.tag]}">${tagLabels[item.tag]}</span>` : '';

      // Priser-tabel
      const prisHtml = item.priser_info && item.priser_info.length
        ? `<div class="menu-card-priser">
            ${item.priser_info.map(p => `
              <div class="menu-card-pris-row">
                <span>${p.label}</span>
                <span class="menu-card-pris-val">${p.pris.toLocaleString('da-DK')} kr/kuvert</span>
              </div>`).join('')}
            ${item.pris_note ? `<p class="menu-card-pris-note">${item.pris_note}</p>` : ''}
            ${item.minimum   ? `<p class="menu-card-minimum">${item.minimum}</p>` : ''}
           </div>` : '';

      // Altid synligt indholdsliste
      const detailsHtml = (item.tilbehoer || item.salatbar)
        ? `<div class="menu-card-details-body">
              ${item.tilbehoer ? `
                <div class="menu-detail-group">
                  <h5>Tilbehør</h5>
                  <ul>${item.tilbehoer.map(t => `<li>${t}</li>`).join('')}</ul>
                </div>` : ''}
              ${item.salatbar ? `
                <div class="menu-detail-group">
                  <h5>Salatbar</h5>
                  <ul class="menu-detail-cols">${item.salatbar.map(t => `<li>${t}</li>`).join('')}</ul>
                </div>` : ''}
           </div>` : '';

      return `
        <div class="menu-card fade-up${item.priser_info ? ' menu-card--detailed' : ''}">
          ${hasImage ? `<div class="menu-img-wrap" ${item.billede_wrap_style ? `style="${item.billede_wrap_style}"` : ''}><img src="${menuBillede}" alt="${item.navn}" ${(item.billede_menu_style || item.billede_style) ? `style="${item.billede_menu_style || item.billede_style}"` : ''} /></div>` : ''}
          <div class="menu-card-body">
            <div class="menu-card-top">
              <h3>${item.navn}</h3>
              ${!item.priser_info ? `<span class="menu-card-price">${formatPrice(item.pris)}</span>` : ''}
            </div>
            <p class="menu-card-desc">${item.beskrivelse}</p>
            ${prisHtml}
            ${detailsHtml}
            ${tagHtml}
          </div>
        </div>`;
    }).join('');

    return `
      <div class="menu-section" id="menu-${key}" data-category="${key}">
        <h2 class="menu-category-title fade-up">${label}</h2>
        <div class="menu-grid">${cards}</div>
      </div>`;
  }).join('');

  const loader = document.getElementById('menu-loader');
  if (loader) loader.remove();

  observeFadeUps();
}

function autoFadeUp() {
  const selectors = [
    '.section-header', '.specialty-card', '.menu-card',
    '.hours-card', '.feature', '.about-image', '.about-grid > div',
    '.footer-brand', '.footer-col', '.contact-card'
  ];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (!el.classList.contains('fade-up') && !el.closest('nav')) {
        el.classList.add('fade-up');
      }
    });
  });
}

function observeFadeUps() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up:not(.visible)').forEach(el => obs.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  autoFadeUp();

  const cached = sessionStorage.getItem('siteContent');
  if (cached) {
    try {
      const data = JSON.parse(cached);
      applyContent(data);
      renderMenuPage(data);
      menuRenderedFromCache = true;
    } catch(e) {}
  }

  loadContent();
});
