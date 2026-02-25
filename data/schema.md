# UrbanCast Zone Data Schema (MVP)

## cities.json
```json
[
  {
    "slug": "porto",
    "name": "Porto",
    "country": "Portugal",
    "description": "...",
    "zones_file": "zones_porto.json"
  }
]
```

## zones_{city}.json
```json
[
  {
    "zone_id": "PT_PRT_Z01",
    "zone_name": "Ribeira Riverfront Bites",
    "tier": "S",
    "zone_character": "1문장 캐릭터",
    "restaurant_count": 42,
    "avg_rating": 4.7,
    "high_rating_ratio": 0.38,
    "cuisine_diversity": 8.1,
    "visibility": "public",
    "video": {
      "youtube_id": "dQw4w9WgXcQ",
      "is_unlisted": false
    },
    "top_places": [
      {
        "name": "Taberna do Cais",
        "rating": 4.8,
        "review_count": 1321,
        "category": "Portuguese",
        "note": "AI 요약"
      }
    ]
  }
]
```

### Notes
- `visibility`:
  - `public`: 공개 영상/대표 Zone
  - `web_only`: 웹에서만 노출하는 Unlisted 후보 Zone
- `video`가 `null`이면 임베드 영역을 숨깁니다.
- 비율 값(`high_rating_ratio`)은 0~1 실수로 입력하고 UI에서 퍼센트로 표시합니다.
