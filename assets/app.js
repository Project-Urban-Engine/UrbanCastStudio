(() => {
  const FALLBACK_DATA = {
    cities: [
      {
        slug: 'porto',
        name: 'Porto',
        country: 'Portugal',
        description: '강변과 구도심의 개성 있는 Food Zone을 추적하는 도시',
        zones_file: 'zones_porto.json',
      },
      {
        slug: 'lisbon',
        name: 'Lisbon',
        country: 'Portugal',
        description: '관광권/로컬권이 섞인 다층형 Food Zone 실험 도시',
        zones_file: 'zones_lisbon.json',
      },
    ],
    zones_porto: [
      { zone_id: 'PT_PRT_Z01', zone_name: 'Ribeira Riverfront Bites', tier: 'S', zone_character: '관광동선 중심이지만 회전율 높은 검증 맛집이 촘촘한 존.', restaurant_count: 42, avg_rating: 4.7, high_rating_ratio: 0.38, cuisine_diversity: 8.1, visibility: 'public', video: { youtube_id: '', is_unlisted: false }, top_places: [{ name: 'Taberna do Cais', rating: 4.8, review_count: 1321, category: 'Portuguese', note: '해산물 라인업이 안정적으로 높게 평가됨.' }] },
      { zone_id: 'PT_PRT_Z02', zone_name: 'Bolhão Market Core', tier: 'S', zone_character: '시장 중심으로 점심 수요가 폭발하는 고밀도 식도락 존.', restaurant_count: 36, avg_rating: 4.6, high_rating_ratio: 0.31, cuisine_diversity: 7.4, visibility: 'public', video: { youtube_id: '', is_unlisted: false } },
      { zone_id: 'PT_PRT_Z03', zone_name: 'Cedofeita Local Labs', tier: 'A', zone_character: '신생 셰프 브랜드와 로컬 단골 가게가 공존하는 탐색형 존.', restaurant_count: 28, avg_rating: 4.5, high_rating_ratio: 0.22, cuisine_diversity: 8.8, visibility: 'web_only', video: { youtube_id: '', is_unlisted: true } },
      { zone_id: 'PT_PRT_Z04', zone_name: 'Boavista Workday Belt', tier: 'A', zone_character: '오피스 수요 기반으로 점심/저녁 피크가 분명한 실속 존.', restaurant_count: 31, avg_rating: 4.4, high_rating_ratio: 0.19, cuisine_diversity: 6.9, visibility: 'public', video: { youtube_id: '', is_unlisted: false } },
      { zone_id: 'PT_PRT_Z05', zone_name: 'Campanhã Station Mix', tier: 'B', zone_character: '환승객 수요 중심의 가성비형 캐주얼 식당이 모인 존.', restaurant_count: 17, avg_rating: 4.1, high_rating_ratio: 0.08, cuisine_diversity: 5.2, visibility: 'web_only', video: { youtube_id: '', is_unlisted: true } },
      { zone_id: 'PT_PRT_Z06', zone_name: 'Foz Coastal Weekend', tier: 'B', zone_character: '주말 집중형 해안 레스토랑이 주도하는 계절 변동 존.', restaurant_count: 14, avg_rating: null, high_rating_ratio: null, cuisine_diversity: null, visibility: 'public', video: null },
    ],
    zones_lisbon: [
      { zone_id: 'PT_LSB_Z01', zone_name: 'Baixa Fast Classics', tier: 'S', zone_character: '관광 핵심권에서 실패 확률이 낮은 클래식 맛집이 밀집한 존.', restaurant_count: 39, avg_rating: 4.7, high_rating_ratio: 0.35, cuisine_diversity: 7.1, visibility: 'public', video: { youtube_id: '', is_unlisted: false } },
      { zone_id: 'PT_LSB_Z02', zone_name: 'Alfama Hidden Steps', tier: 'A', zone_character: '골목형 동선에서 소규모 고평점 식당이 산재한 존.', restaurant_count: 24, avg_rating: 4.5, high_rating_ratio: 0.2, cuisine_diversity: 6.3, visibility: 'web_only', video: { youtube_id: '', is_unlisted: true } },
      { zone_id: 'PT_LSB_Z03', zone_name: 'Bairro Alto Late Night', tier: 'A', zone_character: '야간 유동이 높아 심야식/바푸드 데이터가 풍부한 존.', restaurant_count: 27, avg_rating: 4.3, high_rating_ratio: 0.16, cuisine_diversity: 8, visibility: 'public', video: { youtube_id: '', is_unlisted: false } },
      { zone_id: 'PT_LSB_Z04', zone_name: 'Parque Nations Family Belt', tier: 'B', zone_character: '가족 단위 방문이 많은 대형 상권형 레스토랑 존.', restaurant_count: 19, avg_rating: null, high_rating_ratio: null, cuisine_diversity: 5.7, visibility: 'public', video: null },
    ],
  };

  const DataLoader = {
    fallbackByPath(path) {
      if (path.includes('cities.json')) return FALLBACK_DATA.cities;
      if (path.includes('zones_porto.json')) return FALLBACK_DATA.zones_porto;
      if (path.includes('zones_lisbon.json')) return FALLBACK_DATA.zones_lisbon;
      return null;
    },

    async fetchJson(path) {
      try {
        const response = await fetch(path, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      } catch (error) {
        const fallback = this.fallbackByPath(path);
        if (fallback) {
          console.warn(`Using fallback dataset for ${path}`, error);
          return fallback;
        }
        throw error;
      }
    },

    async loadCities() {
      return this.fetchJson('./data/cities.json');
    },

    async loadZonesByCity(citySlug) {
      const cities = await this.loadCities();
      const city = cities.find((item) => item.slug === citySlug);
      if (!city) throw new Error(`City not found: ${citySlug}`);
      const zones = await this.fetchJson(`./data/${city.zones_file}`);
      return { city, zones, cities };
    },
  };

  const Utils = {
    getQueryParam(name) {
      return new URLSearchParams(window.location.search).get(name);
    },

    zoneUrl(citySlug, zoneId) {
      return `./zone.html?city=${encodeURIComponent(citySlug)}&zone=${encodeURIComponent(zoneId)}`;
    },

    cityUrl(citySlug) {
      return `./city.html?city=${encodeURIComponent(citySlug)}`;
    },

    formatMetric(value, { ratio = false } = {}) {
      if (value === null || value === undefined || value === '') return '-';
      if (ratio) return `${Math.round(value * 100)}%`;
      return value;
    },

    sortZones(a, b) {
      const tierPriority = { S: 0, A: 1, B: 2 };
      const tierDiff = (tierPriority[a.tier] ?? 99) - (tierPriority[b.tier] ?? 99);
      if (tierDiff !== 0) return tierDiff;
      return (b.restaurant_count ?? 0) - (a.restaurant_count ?? 0);
    },
  };

  const Renderer = {
    async renderHome() {
      const cityListEl = document.getElementById('city-list');
      const kpiEl = document.getElementById('home-kpis');
      const featuredEl = document.getElementById('featured-zones');

      const cities = await DataLoader.loadCities();
      const cityWithZones = await Promise.all(
        cities.map(async (city) => {
          const zones = await DataLoader.fetchJson(`./data/${city.zones_file}`);
          return { city, zones };
        })
      );

      const totalZones = cityWithZones.reduce((sum, item) => sum + item.zones.length, 0);
      const publicZones = cityWithZones.reduce(
        (sum, item) => sum + item.zones.filter((zone) => zone.visibility === 'public').length,
        0
      );

      kpiEl.innerHTML = `
        <article class="kpi-card"><p class="kpi-label">Cities</p><p class="kpi-value">${cities.length}</p></article>
        <article class="kpi-card"><p class="kpi-label">Total Zones</p><p class="kpi-value">${totalZones}</p></article>
        <article class="kpi-card"><p class="kpi-label">Public Zones</p><p class="kpi-value">${publicZones}</p></article>
      `;

      cityListEl.innerHTML = '';
      cityWithZones.forEach(({ city, zones }) => {
        const zoneCount = zones.length;
        const publicCount = zones.filter((zone) => zone.visibility === 'public').length;

        const link = document.createElement('a');
        link.className = 'city-card';
        link.href = Utils.cityUrl(city.slug);
        link.innerHTML = `
          <div class="city-head">
            <h3>${city.name}</h3>
            <span class="badge badge-soft">${city.country}</span>
          </div>
          <p>${city.description || ''}</p>
          <p class="city-meta">Total Zones: ${zoneCount}</p>
          <p class="city-meta">Public Zones: ${publicCount}</p>
        `;
        cityListEl.appendChild(link);
      });

      const featured = cityWithZones
        .flatMap(({ city, zones }) =>
          zones
            .filter((zone) => zone.visibility === 'public')
            .sort(Utils.sortZones)
            .slice(0, 2)
            .map((zone) => ({ city, zone }))
        )
        .sort((a, b) => Utils.sortZones(a.zone, b.zone))
        .slice(0, 4);

      featuredEl.innerHTML = '';
      featured.forEach(({ city, zone }) => {
        const item = document.createElement('li');
        item.innerHTML = `
          <a href="${Utils.zoneUrl(city.slug, zone.zone_id)}">
            <strong>${zone.zone_name}</strong>
            <span>${city.name} · Tier ${zone.tier} · ${zone.restaurant_count} restaurants</span>
          </a>
        `;
        featuredEl.appendChild(item);
      });
    },

    async renderCity() {
      const citySlug = Utils.getQueryParam('city');
      if (!citySlug) return this.renderError('도시 정보가 없습니다. Home에서 도시를 선택해 주세요.');

      const { city, zones } = await DataLoader.loadZonesByCity(citySlug);
      document.getElementById('city-title').textContent = `${city.name} Food Zones`;

      const filters = {
        visibility: document.getElementById('visibility-filter'),
        tier: document.getElementById('tier-filter'),
        search: document.getElementById('search-input'),
      };

      const tableBody = document.getElementById('zone-table-body');
      const emptyMessage = document.getElementById('empty-message');

      const update = () => {
        const visibility = filters.visibility.value;
        const tier = filters.tier.value;
        const search = filters.search.value.trim().toLowerCase();

        const filtered = zones
          .filter((zone) => {
            if (visibility !== 'all' && zone.visibility !== visibility) return false;
            if (tier !== 'all' && zone.tier !== tier) return false;
            if (search && !zone.zone_name.toLowerCase().includes(search)) return false;
            return true;
          })
          .sort(Utils.sortZones);

        tableBody.innerHTML = '';
        filtered.forEach((zone) => {
          const tr = document.createElement('tr');
          tr.className = 'zone-row';
          tr.tabIndex = 0;
          tr.innerHTML = `
            <td>${zone.zone_name}</td>
            <td><span class="badge">${zone.tier}</span></td>
            <td>${zone.visibility === 'public' ? 'Public' : 'Web-only'}</td>
            <td>${Utils.formatMetric(zone.restaurant_count)}</td>
            <td>${Utils.formatMetric(zone.avg_rating)}</td>
            <td>${Utils.formatMetric(zone.high_rating_ratio, { ratio: true })}</td>
          `;

          const goToDetail = () => {
            window.location.href = Utils.zoneUrl(citySlug, zone.zone_id);
          };

          tr.addEventListener('click', goToDetail);
          tr.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              goToDetail();
            }
          });
          tableBody.appendChild(tr);
        });

        emptyMessage.hidden = filtered.length > 0;
      };

      filters.visibility.addEventListener('change', update);
      filters.tier.addEventListener('change', update);
      filters.search.addEventListener('input', update);
      update();
    },

    async renderZone() {
      const citySlug = Utils.getQueryParam('city');
      const zoneId = Utils.getQueryParam('zone');
      if (!citySlug || !zoneId) return this.renderError('Zone 정보가 없습니다. City 페이지에서 Zone을 선택해 주세요.');

      const { city, zones } = await DataLoader.loadZonesByCity(citySlug);
      const zone = zones.find((item) => item.zone_id === zoneId);
      if (!zone) return this.renderError('요청한 Zone을 찾을 수 없습니다.');

      document.getElementById('back-to-city').href = Utils.cityUrl(citySlug);
      document.getElementById('zone-name').textContent = `${zone.zone_name} (Tier ${zone.tier})`;
      document.getElementById('zone-character').textContent = zone.zone_character;

      const metrics = [
        { label: 'City', value: city.name },
        { label: 'Restaurant Count', value: Utils.formatMetric(zone.restaurant_count) },
        { label: 'Avg Rating', value: Utils.formatMetric(zone.avg_rating) },
        { label: 'High Rating Ratio', value: Utils.formatMetric(zone.high_rating_ratio, { ratio: true }) },
        { label: 'Cuisine Diversity', value: Utils.formatMetric(zone.cuisine_diversity) },
        { label: 'Visibility', value: zone.visibility === 'public' ? 'Public' : 'Web-only' },
      ];

      const metricGrid = document.getElementById('zone-metrics');
      metricGrid.innerHTML = '';
      metrics.forEach((metric) => {
        const card = document.createElement('article');
        card.className = 'metric-card';
        card.innerHTML = `<div class="metric-title">${metric.label}</div><div class="metric-value">${metric.value}</div>`;
        metricGrid.appendChild(card);
      });

      const topPlaces = document.getElementById('top-places');
      const topPlacesEmpty = document.getElementById('top-places-empty');
      topPlaces.innerHTML = '';
      if (Array.isArray(zone.top_places) && zone.top_places.length > 0) {
        zone.top_places.forEach((place) => {
          const item = document.createElement('li');
          item.innerHTML = `<strong>${place.name}</strong> · 평점 ${Utils.formatMetric(place.rating)} · 리뷰 ${Utils.formatMetric(place.review_count)}${place.category ? ` · ${place.category}` : ''}${place.note ? `<br>${place.note}` : ''}`;
          topPlaces.appendChild(item);
        });
        topPlacesEmpty.hidden = true;
      } else {
        topPlacesEmpty.hidden = false;
      }

      const videoSection = document.getElementById('video-section');
      const videoWrap = document.getElementById('video-wrap');
      const youtubeId = zone.video?.youtube_id?.trim();
      if (youtubeId) {
        videoWrap.innerHTML = `<iframe src="https://www.youtube.com/embed/${youtubeId}" title="${zone.zone_name} video" allowfullscreen loading="lazy"></iframe>`;
      } else {
        videoWrap.innerHTML = '<div class="video-placeholder">YouTube 영상 링크는 아직 비어 있습니다.</div>';
      }
      videoSection.hidden = false;
    },

    renderError(message) {
      const main = document.querySelector('main');
      if (main) {
        main.innerHTML = `<section class="content-section"><p class="empty-message">${message}</p></section>`;
      }
    },
  };

  async function bootstrap() {
    const page = document.body.dataset.page;
    try {
      if (page === 'home') await Renderer.renderHome();
      if (page === 'city') await Renderer.renderCity();
      if (page === 'zone') await Renderer.renderZone();
    } catch (error) {
      console.error(error);
      Renderer.renderError('데이터를 불러오는 중 오류가 발생했습니다. (미리보기 환경에서는 폴백 데이터를 사용합니다)');
    }
  }

  bootstrap();
})();
