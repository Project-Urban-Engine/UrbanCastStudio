(() => {
  const DataLoader = {
    async fetchJson(path) {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${path}: ${response.status}`);
      }
      return response.json();
    },

    async loadCities() {
      return this.fetchJson('./data/cities.json');
    },

    async loadZonesByCity(citySlug) {
      const cities = await this.loadCities();
      const city = cities.find((item) => item.slug === citySlug);
      if (!city) {
        throw new Error(`City not found: ${citySlug}`);
      }
      const zones = await this.fetchJson(`./data/${city.zones_file}`);
      return { city, zones };
    },
  };

  const Utils = {
    getQueryParam(name) {
      const params = new URLSearchParams(window.location.search);
      return params.get(name);
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
      const cities = await DataLoader.loadCities();

      const cityCards = await Promise.all(
        cities.map(async (city) => {
          const zones = await DataLoader.fetchJson(`./data/${city.zones_file}`);
          const zoneCount = zones.length;
          const publicCount = zones.filter((zone) => zone.visibility === 'public').length;

          const link = document.createElement('a');
          link.className = 'city-card';
          link.href = Utils.cityUrl(city.slug);
          link.innerHTML = `
            <h3>${city.name}</h3>
            <p>${city.description || ''}</p>
            <p class="city-meta">Total Zones: ${zoneCount}</p>
            <p class="city-meta">Public Zones: ${publicCount}</p>
          `;
          return link;
        })
      );

      cityCards.forEach((card) => cityListEl.appendChild(card));
    },

    async renderCity() {
      const citySlug = Utils.getQueryParam('city');
      if (!citySlug) {
        this.renderError('도시 정보가 없습니다. Home에서 도시를 선택해 주세요.');
        return;
      }

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
      if (!citySlug || !zoneId) {
        this.renderError('Zone 정보가 없습니다. City 페이지에서 Zone을 선택해 주세요.');
        return;
      }

      const { city, zones } = await DataLoader.loadZonesByCity(citySlug);
      const zone = zones.find((item) => item.zone_id === zoneId);
      if (!zone) {
        this.renderError('요청한 Zone을 찾을 수 없습니다.');
        return;
      }

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
          const rating = Utils.formatMetric(place.rating);
          const reviews = Utils.formatMetric(place.review_count);
          item.innerHTML = `<strong>${place.name}</strong> · 평점 ${rating} · 리뷰 ${reviews}${place.category ? ` · ${place.category}` : ''}${place.note ? `<br>${place.note}` : ''}`;
          topPlaces.appendChild(item);
        });
        topPlacesEmpty.hidden = true;
      } else {
        topPlacesEmpty.hidden = false;
      }

      if (zone.video && zone.video.youtube_id) {
        const videoSection = document.getElementById('video-section');
        const videoWrap = document.getElementById('video-wrap');
        videoWrap.innerHTML = `<iframe src="https://www.youtube.com/embed/${zone.video.youtube_id}" title="${zone.zone_name} video" allowfullscreen loading="lazy"></iframe>`;
        videoSection.hidden = false;
      }
    },

    renderError(message) {
      const main = document.querySelector('main');
      main.innerHTML = `<p class="empty-message">${message}</p>`;
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
      Renderer.renderError('데이터를 불러오는 중 오류가 발생했습니다.');
    }
  }

  bootstrap();
})();
