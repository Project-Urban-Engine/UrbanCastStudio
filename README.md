# UrbanCast 도시 데이터 허브 (MVP)

GitHub Pages에 바로 배포 가능한 정적 사이트입니다. 핵심 목표는 **도시별 Food Zone 데이터 축적/조회**입니다.

## 파일 구조

- `index.html` : Home (도시 목록)
- `city.html` : 도시별 Zone 목록 + 필터/검색
- `zone.html` : Zone 상세 (지표 + top places + YouTube)
- `assets/styles.css` : 공통 스타일
- `assets/app.js` : 공통 JS (data loader / renderer / utils)
- `data/cities.json` : 도시 목록
- `data/zones_porto.json` : Porto Zone 샘플
- `data/zones_lisbon.json` : Lisbon Zone 샘플
- `data/schema.md` : 데이터 스키마 안내

## 로컬 실행

정적 파일이므로 간단한 HTTP 서버로 확인할 수 있습니다.

```bash
python -m http.server 8000
```

브라우저에서 `http://localhost:8000` 접속.

## GitHub Pages 배포

1. 이 저장소를 GitHub에 push
2. GitHub 저장소의 **Settings → Pages**로 이동
3. **Build and deployment**에서
   - Source: `Deploy from a branch`
   - Branch: `main` (또는 배포 브랜치), Folder: `/ (root)`
4. Save 후 수 분 내 배포 URL 생성

> 상대 경로(`./assets/...`, `./data/...`)를 사용하므로 GitHub Pages에서 바로 동작합니다.
