(() => {
  /* ============================================================
     CONFIG
     ============================================================ */
  const FEATURED_LIMIT = 5; // Max zones shown in Featured section — change here to adjust

  /* ============================================================
     FALLBACK DATA  (used when JSON fetch fails in local preview)
     ============================================================ */
  const FALLBACK_DATA = {
    cities: [
      { slug: 'porto', name: 'Porto', country: 'Portugal', country_code: 'pt', description: 'Riverside charm meets gritty old town — tracking the city\'s boldest Food Zones.', zones_file: 'zones_porto.json' },
      { slug: 'lisbon', name: 'Lisbon', country: 'Portugal', country_code: 'pt', description: 'Tourist corridors blending with hyper-local layers — a multi-tier Food Zone lab.', zones_file: 'zones_lisbon.json' },
    ],
    zones_porto: [
      { zone_id: 'PT_PRT_Z01', coordinates: { lat: 41.1403, lng: -8.6147 }, bounds: [[41.1378, -8.6195], [41.1428, -8.6088]], zone_name: 'Ribeira Riverfront Bites', tier: 'S', area: ['Waterfront', 'Tourist'], zone_character: 'High-traffic tourist corridor packed with vetted spots — dense, reliable, well-reviewed.', restaurant_count: 42, avg_rating: 4.7, high_rating_ratio: 0.38, cuisine_diversity: 8.1, visibility: 'public', video: { youtube_id: 'dQw4w9WgXcQ', is_unlisted: false }, top_places: [{ name: 'Taberna do Cais', rating: 4.8, review_count: 1321, category: 'Portuguese', note: 'Seafood lineup consistently earns top marks.' }, { name: 'Cantinho do Avillez', rating: 4.7, review_count: 980, category: 'Modern Portuguese', note: null }] },
      { zone_id: 'PT_PRT_Z02', coordinates: { lat: 41.1484, lng: -8.6085 }, bounds: [[41.1458, -8.6128], [41.1512, -8.6030]], zone_name: 'Bolhão Market Core', tier: 'S', area: ['Market', 'Local'], zone_character: 'Market-driven zone with explosive lunch demand and exceptional food density.', restaurant_count: 36, avg_rating: 4.6, high_rating_ratio: 0.31, cuisine_diversity: 7.4, visibility: 'public', video: { youtube_id: '', is_unlisted: false }, top_places: [] },
      { zone_id: 'PT_PRT_Z03', coordinates: { lat: 41.1527, lng: -8.6252 }, bounds: [[41.1495, -8.6320], [41.1560, -8.6170]], zone_name: 'Cedofeita Local Labs', tier: 'A', area: ['Local', 'Nightlife'], zone_character: 'Emerging chef brands alongside long-standing local regulars — the best zone for discovery.', restaurant_count: 28, avg_rating: 4.5, high_rating_ratio: 0.22, cuisine_diversity: 8.8, visibility: 'web_only', video: { youtube_id: '', is_unlisted: true }, top_places: [] },
      { zone_id: 'PT_PRT_Z04', coordinates: { lat: 41.1579, lng: -8.6432 }, bounds: [[41.1540, -8.6530], [41.1618, -8.6330]], zone_name: 'Boavista Workday Belt', tier: 'A', area: ['Business'], zone_character: 'Office-driven demand with sharp lunch and dinner peaks — practical and unpretentious.', restaurant_count: 31, avg_rating: 4.4, high_rating_ratio: 0.19, cuisine_diversity: 6.9, visibility: 'public', video: { youtube_id: '', is_unlisted: false }, top_places: [] },
      { zone_id: 'PT_PRT_Z05', coordinates: { lat: 41.1490, lng: -8.5792 }, bounds: [[41.1455, -8.5860], [41.1525, -8.5720]], zone_name: 'Campanhã Station Mix', tier: 'B', area: ['Transit', 'Local'], zone_character: 'Transit commuter zone — casual, budget-friendly spots clustered around the station.', restaurant_count: 17, avg_rating: 4.1, high_rating_ratio: 0.08, cuisine_diversity: 5.2, visibility: 'web_only', video: { youtube_id: '', is_unlisted: true }, top_places: [] },
      { zone_id: 'PT_PRT_Z06', coordinates: { lat: 41.1504, lng: -8.6783 }, bounds: [[41.1465, -8.6880], [41.1545, -8.6680]], zone_name: 'Foz Coastal Weekend', tier: 'B', area: ['Coastal', 'Family'], zone_character: 'Weekend-heavy coastal dining with seasonal volume swings and ocean views.', restaurant_count: 14, avg_rating: null, high_rating_ratio: null, cuisine_diversity: null, visibility: 'public', video: null, top_places: [] },
    ],
    zones_lisbon: [
      { zone_id: 'PT_LSB_Z01', coordinates: { lat: 38.7139, lng: -9.1395 }, bounds: [[38.7108, -9.1440], [38.7175, -9.1340]], zone_name: 'Baixa Fast Classics', tier: 'S', area: ['Tourist', 'Historic'], zone_character: 'Tourist core packed with reliable classics — low risk, consistently high reward.', restaurant_count: 39, avg_rating: 4.7, high_rating_ratio: 0.35, cuisine_diversity: 7.1, visibility: 'public', video: { youtube_id: '', is_unlisted: false }, top_places: [] },
      { zone_id: 'PT_LSB_Z02', coordinates: { lat: 38.7100, lng: -9.1262 }, bounds: [[38.7068, -9.1315], [38.7135, -9.1200]], zone_name: 'Alfama Hidden Steps', tier: 'A', area: ['Historic', 'Local'], zone_character: 'Alley-style district with small, high-rated spots hidden along every winding stairway.', restaurant_count: 24, avg_rating: 4.5, high_rating_ratio: 0.2, cuisine_diversity: 6.3, visibility: 'web_only', video: { youtube_id: '', is_unlisted: true }, top_places: [] },
      { zone_id: 'PT_LSB_Z03', coordinates: { lat: 38.7119, lng: -9.1458 }, bounds: [[38.7090, -9.1510], [38.7152, -9.1400]], zone_name: 'Bairro Alto Late Night', tier: 'A', area: ['Nightlife', 'Local'], zone_character: 'High late-night foot traffic — rich data on after-midnight eats and bar-food culture.', restaurant_count: 27, avg_rating: 4.3, high_rating_ratio: 0.16, cuisine_diversity: 8, visibility: 'public', video: { youtube_id: '', is_unlisted: false }, top_places: [] },
      { zone_id: 'PT_LSB_Z04', coordinates: { lat: 38.7638, lng: -9.0980 }, bounds: [[38.7570, -9.1080], [38.7710, -9.0880]], zone_name: 'Parque Nations Family Belt', tier: 'B', area: ['Family', 'Waterfront'], zone_character: 'Family-oriented district with large commercial restaurants and broad mainstream appeal.', restaurant_count: 19, avg_rating: null, high_rating_ratio: null, cuisine_diversity: 5.7, visibility: 'public', video: null, top_places: [] },
    ],
  };

  /* ============================================================
     DATA LOADER
     ============================================================ */
  const DataLoader = {
    _fallback(path) {
      if (path.includes('cities.json')) return FALLBACK_DATA.cities;
      if (path.includes('zones_porto.json')) return FALLBACK_DATA.zones_porto;
      if (path.includes('zones_lisbon.json')) return FALLBACK_DATA.zones_lisbon;
      return null;
    },

    async fetchJson(path) {
      try {
        const res = await fetch(path, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      } catch (err) {
        const fb = this._fallback(path);
        if (fb) { console.warn(`Fallback → ${path}`, err); return fb; }
        throw err;
      }
    },

    async loadCities() {
      return this.fetchJson('./data/cities.json');
    },

    async loadZonesByCity(citySlug) {
      const cities = await this.loadCities();
      const city = cities.find(c => c.slug === citySlug);
      if (!city) throw new Error(`City not found: ${citySlug}`);
      const zones = await this.fetchJson(`./data/${city.zones_file}`);
      return { city, zones, cities };
    },
  };

  /* ============================================================
     UTILS
     ============================================================ */
  const Utils = {
    getQueryParam(name) {
      return new URLSearchParams(window.location.search).get(name);
    },
    cityUrl(slug) {
      return `./city.html?city=${encodeURIComponent(slug)}`;
    },
    zoneUrl(citySlug, zoneId) {
      return `./zone.html?city=${encodeURIComponent(citySlug)}&zone=${encodeURIComponent(zoneId)}`;
    },
    fmt(value, { ratio = false } = {}) {
      if (value === null || value === undefined || value === '') return '\u2014';
      if (ratio) return `${Math.round(value * 100)}%`;
      return String(value);
    },
    sortZones(a, b) {
      const p = { S: 0, A: 1, B: 2 };
      const d = (p[a.tier] ?? 9) - (p[b.tier] ?? 9);
      return d !== 0 ? d : (b.restaurant_count ?? 0) - (a.restaurant_count ?? 0);
    },
    // City accent colors for visual variety
    cityAccent(index) {
      const accents = [
        'rgba(255,69,0,0.15)',    // orange
        'rgba(124,58,237,0.14)',  // violet
        'rgba(34,211,238,0.12)', // cyan
        'rgba(245,158,11,0.14)', // amber
      ];
      return accents[index % accents.length];
    },
  };

  /* ============================================================
     RENDERER
     ============================================================ */
  const Renderer = {

    /* ---------- HOME ---------- */
    async renderHome() {
      const cityListEl = document.getElementById('city-list');
      const featuredEl = document.getElementById('featured-zones');
      const kpiCities = document.getElementById('kpi-cities');
      const kpiZones = document.getElementById('kpi-zones');
      const kpiPublic = document.getElementById('kpi-public');

      const cities = await DataLoader.loadCities();
      const cityWithZones = await Promise.all(
        cities.map(async (city) => {
          const zones = await DataLoader.fetchJson(`./data/${city.zones_file}`);
          return { city, zones };
        })
      );

      // KPIs
      const totalZones = cityWithZones.reduce((s, d) => s + d.zones.length, 0);
      const publicZones = cityWithZones.reduce((s, d) => s + d.zones.filter(z => z.visibility === 'public').length, 0);
      kpiCities.textContent = cities.length;
      kpiZones.textContent = totalZones;
      kpiPublic.textContent = publicZones;

      // City cards
      cityListEl.innerHTML = '';
      cityWithZones.forEach(({ city, zones }, idx) => {
        const total = zones.length;
        const pub = zones.filter(z => z.visibility === 'public').length;
        const accent = Utils.cityAccent(idx);

        const a = document.createElement('a');
        a.className = 'city-card';
        a.href = Utils.cityUrl(city.slug);
        a.style.setProperty('--city-accent', accent);
        a.innerHTML = `
          <div class="city-card-head">
            <h3>${city.name}</h3>
            <span class="country-pill">${city.country_code ? `<span class="fi fi-${city.country_code}"></span>` : ''} ${city.country}</span>
          </div>
          <p class="city-desc">${city.description || ''}</p>
          <div class="city-stats">
            <div class="city-stat">
              <span class="city-stat-val">${total}</span>
              <span class="city-stat-label">Total Zones</span>
            </div>
            <div class="city-stat">
              <span class="city-stat-val">${pub}</span>
              <span class="city-stat-label">Filmed</span>
            </div>
          </div>
          <span class="city-arrow" aria-hidden="true">↗</span>
        `;
        cityListEl.appendChild(a);
      });

      // Featured zones
      // Rules: filmed (has youtube_id) · sorted by avg_rating desc · FEATURED_LIMIT cap · ≥1 per city
      const ratingDesc = (a, b) => (b.zone.avg_rating ?? -1) - (a.zone.avg_rating ?? -1);

      const filmedPool = cityWithZones
        .flatMap(({ city, zones }) =>
          zones
            .filter(z => z.visibility === 'public')
            .map(zone => ({ city, zone }))
        )
        .sort(ratingDesc);

      // Reserve the best filmed zone per city (guarantees ≥1 per city when within limit)
      const reservedIds = new Set();
      const reserved = [];
      for (const { city } of cityWithZones) {
        const best = filmedPool.find(e => e.city.slug === city.slug);
        if (best) {
          reserved.push(best);
          reservedIds.add(best.zone.zone_id);
        }
      }

      let featured;
      if (reserved.length >= FEATURED_LIMIT) {
        // More cities than limit — cutoff: just take top-rated reserved
        featured = reserved.sort(ratingDesc).slice(0, FEATURED_LIMIT);
      } else {
        // Fill remaining slots from global pool (exclude already reserved)
        const extras = filmedPool.filter(e => !reservedIds.has(e.zone.zone_id));
        const picked = [...reserved];
        for (const entry of extras) {
          if (picked.length >= FEATURED_LIMIT) break;
          picked.push(entry);
        }
        featured = picked.sort(ratingDesc);
      }

      featuredEl.innerHTML = '';
      if (featured.length === 0) {
        featuredEl.innerHTML = '<li class="empty-state">No filmed zones available.</li>';
        return;
      }
      featured.forEach(({ city, zone }) => {
        const li = document.createElement('li');
        li.className = 'featured-item';
        li.dataset.tier = zone.tier;
        li.innerHTML = `
          <a class="featured-link" href="${Utils.zoneUrl(city.slug, zone.zone_id)}">
            <span class="featured-tier-badge" data-tier="${zone.tier}">${zone.tier}</span>
            <span class="featured-name">${zone.zone_name}</span>
            <span class="featured-meta">${city.name} · ${zone.restaurant_count} restaurants</span>
          </a>
        `;
        featuredEl.appendChild(li);
      });
    },

    /* ---------- CITY ---------- */
    async renderCity() {
      const citySlug = Utils.getQueryParam('city');
      if (!citySlug) return this.renderError('No city selected. Please choose a city from the home page.');

      const { city, zones } = await DataLoader.loadZonesByCity(citySlug);

      // Update title + breadcrumb
      document.title = `UrbanCast — ${city.name} Zones`;
      const titleEl = document.getElementById('city-title');
      const crumbEl = document.getElementById('city-breadcrumb');
      if (titleEl) titleEl.textContent = `${city.name} Food Zones`;
      if (crumbEl) crumbEl.textContent = city.name;

      // Filter state — area is a Set for multi-select, tier is single
      const state = { areas: new Set(), tier: 'all', search: '' };

      // Build area filter pills dynamically from zone data
      const areaPillsEl = document.getElementById('area-pills');
      const areaValues = [...new Set(zones.flatMap(z => Array.isArray(z.area) ? z.area : (z.area ? [z.area] : [])).sort())];
      areaPillsEl.innerHTML = [
        `<button class="filter-pill active" data-filter="area" data-value="all">All</button>`,
        ...areaValues.map(a => `<button class="filter-pill" data-filter="area" data-value="${a}">${a}</button>`)
      ].join('');

      const allAreaBtn = areaPillsEl.querySelector('[data-value="all"]');

      const syncAreaPills = () => {
        const isEmpty = state.areas.size === 0;
        allAreaBtn.classList.toggle('active', isEmpty);
        areaPillsEl.querySelectorAll('[data-value]:not([data-value="all"])').forEach(p => {
          p.classList.toggle('active', state.areas.has(p.dataset.value));
        });
      };

      // Area pills — multi-select toggle
      areaPillsEl.addEventListener('click', e => {
        const btn = e.target.closest('.filter-pill');
        if (!btn) return;
        const val = btn.dataset.value;
        if (val === 'all') {
          state.areas.clear();
        } else {
          if (state.areas.has(val)) state.areas.delete(val);
          else state.areas.add(val);
        }
        syncAreaPills();
        renderGrid();
      });

      // Tier pills — single select (radio)
      document.querySelectorAll('.filter-pill[data-filter="tier"]').forEach(btn => {
        btn.addEventListener('click', () => {
          state.tier = btn.dataset.value;
          document.querySelectorAll('.filter-pill[data-filter="tier"]').forEach(p => {
            p.classList.toggle('active', p.dataset.value === state.tier);
          });
          renderGrid();
        });
      });

      // Search
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        searchInput.addEventListener('input', () => {
          state.search = searchInput.value.trim().toLowerCase();
          renderGrid();
        });
      }

      const gridEl = document.getElementById('zone-grid');

      const renderGrid = () => {
        const filtered = zones
          .filter(z => {
            if (state.areas.size > 0) {
              const zAreas = Array.isArray(z.area) ? z.area : (z.area ? [z.area] : []);
              if (!zAreas.some(a => state.areas.has(a))) return false;
            }
            if (state.tier !== 'all' && z.tier !== state.tier) return false;
            if (state.search && !z.zone_name.toLowerCase().includes(state.search)) return false;
            return true;
          })
          .sort(Utils.sortZones);

        gridEl.innerHTML = '';

        if (filtered.length === 0) {
          gridEl.innerHTML = '<div class="empty-state">No zones match your filters.</div>';
          return;
        }

        filtered.forEach(zone => {
          const hasVideo = zone.visibility === 'public';

          const card = document.createElement('article');
          card.className = 'zone-card';
          card.dataset.tier = zone.tier;
          card.setAttribute('tabindex', '0');
          card.setAttribute('role', 'button');
          card.setAttribute('aria-label', `${zone.zone_name} — view zone details`);

          card.innerHTML = `
            <div class="zone-card-head">
              <div class="zone-card-badges">
                <span class="zone-tier-chip" data-tier="${zone.tier}">Tier ${zone.tier}</span>
                ${(Array.isArray(zone.area) ? zone.area : (zone.area ? [zone.area] : [])).map(a => `<span class="zone-area-chip">${a}</span>`).join('')}
              </div>
              ${hasVideo ? '<span class="zone-video-dot" title="Has video">▶</span>' : ''}
            </div>
            <p class="zone-card-name">${zone.zone_name}</p>
            <p class="zone-card-char">${zone.zone_character || ''}</p>
            <div class="zone-card-metrics">
              <div class="zone-metric">
                <span class="zone-metric-val">${Utils.fmt(zone.restaurant_count)}</span>
                <span class="zone-metric-label">Restaurants</span>
              </div>
              <div class="zone-metric">
                <span class="zone-metric-val">${Utils.fmt(zone.avg_rating)}</span>
                <span class="zone-metric-label">Avg Rating</span>
              </div>
              <div class="zone-metric">
                <span class="zone-metric-val">${Utils.fmt(zone.high_rating_ratio, { ratio: true })}</span>
                <span class="zone-metric-label">4.8+ Ratio</span>
              </div>
            </div>
          `;

          const go = () => { window.location.href = Utils.zoneUrl(citySlug, zone.zone_id); };
          card.addEventListener('click', go);
          card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
          gridEl.appendChild(card);
        });
      };

      renderGrid();
    },

    /* ---------- ZONE DETAIL ---------- */
    async renderZone() {
      const citySlug = Utils.getQueryParam('city');
      const zoneId = Utils.getQueryParam('zone');
      if (!citySlug || !zoneId) return this.renderError('No zone selected. Please choose a zone from the city page.');

      const { city, zones } = await DataLoader.loadZonesByCity(citySlug);
      const zone = zones.find(z => z.zone_id === zoneId);
      if (!zone) return this.renderError('Zone not found.');

      document.title = `UrbanCast — ${zone.zone_name}`;

      // Back link
      const backLink = document.getElementById('back-to-city');
      if (backLink) backLink.href = Utils.cityUrl(citySlug);

      // Tier badge
      const tierBadge = document.getElementById('zone-tier-badge');
      if (tierBadge) { tierBadge.textContent = `Tier ${zone.tier}`; tierBadge.dataset.tier = zone.tier; }

      // Title + character
      const nameEl = document.getElementById('zone-name');
      const charEl = document.getElementById('zone-character');
      if (nameEl) nameEl.textContent = zone.zone_name;
      if (charEl) charEl.textContent = zone.zone_character || '';

      // Metrics
      const metricsEl = document.getElementById('zone-metrics');
      if (metricsEl) {
        const metrics = [
          { label: 'City', value: city.name },
          { label: 'Restaurants', value: Utils.fmt(zone.restaurant_count) },
          { label: 'Avg Rating', value: Utils.fmt(zone.avg_rating) },
          { label: '4.8+ Ratio', value: Utils.fmt(zone.high_rating_ratio, { ratio: true }) },
          { label: 'Diversity Index', value: Utils.fmt(zone.cuisine_diversity) },
          { label: 'Visibility', value: zone.visibility === 'public' ? 'Filmed' : 'Web-only' },
        ];
        metricsEl.innerHTML = metrics.map(m => `
          <div class="metric-card">
            <p class="metric-title">${m.label}</p>
            <p class="metric-value">${m.value}</p>
          </div>
        `).join('');
      }

      // Top places
      const placesEl = document.getElementById('top-places');
      const placesEmptyEl = document.getElementById('top-places-empty');
      if (placesEl) {
        placesEl.innerHTML = '';
        if (Array.isArray(zone.top_places) && zone.top_places.length > 0) {
          if (placesEmptyEl) placesEmptyEl.hidden = true;
          zone.top_places.forEach((place, i) => {
            const li = document.createElement('li');
            li.className = 'place-item';
            const catStr = place.category ? `${place.category}` : '';
            const revStr = place.review_count ? ` · ${place.review_count} reviews` : '';
            li.innerHTML = `
              <span class="place-rank">${String(i + 1).padStart(2, '0')}</span>
              <div class="place-info">
                <p class="place-name">${place.name}</p>
                <p class="place-sub">${catStr}${revStr}</p>
                ${place.note ? `<p class="place-note">${place.note}</p>` : ''}
              </div>
              ${place.rating !== null && place.rating !== undefined ? `<span class="place-rating">★ ${place.rating}</span>` : ''}
            `;
            placesEl.appendChild(li);
          });
        } else {
          if (placesEmptyEl) placesEmptyEl.hidden = false;
        }
      }

      // Video
      const videoWrap = document.getElementById('video-wrap');
      const videoLabel = document.getElementById('video-label');
      if (videoWrap) {
        const ytId = zone.video?.youtube_id?.trim();
        if (ytId) {
          videoWrap.innerHTML = `<iframe src="https://www.youtube.com/embed/${ytId}" title="${zone.zone_name} video" allowfullscreen loading="lazy"></iframe>`;
          if (videoLabel) videoLabel.textContent = zone.video.is_unlisted ? 'YouTube (Unlisted)' : 'YouTube Shorts';
        } else {
          videoWrap.innerHTML = '<div class="video-placeholder">No video linked yet.</div>';
          if (videoLabel) videoLabel.textContent = 'No video';
        }
      }

      // Map
      const mapEl = document.getElementById('zone-map');
      if (mapEl && zone.coordinates && typeof L !== 'undefined') {
        const { lat, lng } = zone.coordinates;

        // Tier → color map (matches CSS vars)
        const TIER_COLOR = { S: '#f59e0b', A: '#a78bfa', B: '#22d3ee' };
        const color = TIER_COLOR[zone.tier] || '#ff4500';

        // Auto-fit: use bounds if available, else center on coordinates
        const map = L.map('zone-map', {
          zoomControl: true,
          scrollWheelZoom: true,
        });

        L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 20,
        }).addTo(map);

        if (zone.bounds) {
          const rect = L.rectangle(zone.bounds, {
            color,
            weight: 2,
            opacity: 0.9,
            fillColor: color,
            fillOpacity: 0.18,
          }).addTo(map);
          rect.bindPopup(`<strong>${zone.zone_name}</strong>Tier ${zone.tier} · ${zone.restaurant_count ?? '—'} restaurants`);
          map.fitBounds(zone.bounds, { padding: [40, 40] });
        } else {
          map.setView([lat, lng], 15);
        }

        // Center marker
        const icon = L.divIcon({
          className: '',
          html: `<div class="map-marker-pin" style="background:${color};box-shadow:0 0 16px ${color}99"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
          popupAnchor: [0, -12],
        });
        L.marker([lat, lng], { icon }).addTo(map);
      } else if (mapEl) {
        mapEl.innerHTML = '<div class="video-placeholder">Map data not available.</div>';
      }
    },

    renderError(message) {
      const main = document.querySelector('main');
      if (main) {
        main.innerHTML = `
          <div class="container" style="padding: 4rem 0;">
            <div style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 2rem; color: var(--muted); font-size: 0.95rem;">
              ${message}
            </div>
          </div>`;
      }
    },
  };

  /* ============================================================
     BOOTSTRAP
     ============================================================ */
  async function bootstrap() {
    const page = document.body.dataset.page;
    try {
      if (page === 'home') await Renderer.renderHome();
      if (page === 'city') await Renderer.renderCity();
      if (page === 'zone') await Renderer.renderZone();
    } catch (err) {
      console.error(err);
      Renderer.renderError('Failed to load data. Please try again later.');
    }
  }

  bootstrap();
})();