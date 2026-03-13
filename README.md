# comfort-publish

컴포트성형외과 퍼블리싱 프로젝트입니다.  
정적 HTML/CSS/JS 기반으로 구성되어 있으며, 현재는 PC 시안 중심으로 초안이 작성된 상태입니다.

## 실행 방법

프로젝트 루트에서 간단한 정적 서버를 띄우면 됩니다.

```bash
python3 -m http.server 8000
```

브라우저에서 아래 주소로 확인합니다.

```text
http://localhost:8000
```

## 파일 구조

```text
index.html
css/style.css
js/main.js
assets/images/main/*
```

## 네이밍 원칙

디자인 툴에서 넘어온 산출물식 이름 대신, 현재 코드에서는 의미 기반 이름으로 정리하는 방향을 사용합니다.

- 이미지 파일명: 화면/역할 기준으로 작성
- 클래스명: 섹션 + 역할 기준으로 작성
- 예시:
  - `mv-bu6i4108.png` → `hero-clinic-interior.png`
  - `sec2-dul-2371.png` → `tattoo-removal-treatment.png`
  - `rectangle-1-copy` → `header-dropdown-panel`
  - `group-11` → `gnb-list`
  - `rectangle-40` → `quick-menu-link`

남은 파일이나 클래스도 같은 기준으로 계속 정리할 예정입니다.

## 주요 섹션

- `mv`: 메인 비주얼
- `sec2`: 문신제거 서비스 소개 / 탭 인터랙션
- `sec3`: 컴포트만의 강점 카드
- `sec4`: 의료진/케어 소개
- `sec5`: 피코 레이저 소개
- `sec6`: 시술 후 케어 시스템 카드
- `sec7`: 결과 캐러셀, 오시는 길, 푸터

## sec7 결과 영역 백엔드 연동

`sec7` 결과 캐러셀은 백엔드 연동 가능한 형태로 구성되어 있습니다.

`index.html`의 `#sec7Carousel`에 API 주소를 넣으면 됩니다.

```html
<div class="sec7-results-carousel" id="sec7Carousel" data-api-url="">
  <div class="sec7-results-track" id="sec7Track"></div>
</div>
```

예시:

```html
<div class="sec7-results-carousel" id="sec7Carousel" data-api-url="/api/results">
```

### 지원하는 응답 형태

- 배열 직접 반환
- 또는 `items`, `results`, `data` 키 내부 배열

예시:

```json
{
  "items": [
    {
      "round": "[손가락] 5회차",
      "caption": "시술 후 4개월 경과",
      "beforeImageUrl": "https://example.com/before.jpg",
      "afterImageUrl": "https://example.com/after.jpg",
      "beforePosition": "center",
      "afterPosition": "center"
    }
  ]
}
```

### 허용 필드명

- 회차: `round`, `roundLabel`, `title`
- 설명: `caption`, `elapsedText`, `description`
- 비포 이미지: `beforeImageUrl`, `beforeImage`
- 애프터 이미지: `afterImageUrl`, `afterImage`
- 포지션: `beforePosition`, `afterPosition`

API가 비어 있거나 실패하면 프론트에 들어 있는 샘플 데이터로 fallback 됩니다.

## 주요 변경내용

### 2026-03-13

- `sec4` 타이포와 한 줄 처리 보정
- `sec5` 피코 레이저 기기 배치 및 크기 보정
- `sec7` 타이틀/오시는 길 레이아웃 보정
- 이미지 파일명과 일부 클래스명을 의미 기반 네이밍으로 정리
- `sec5` 장비 이미지, `sec7` 결과 샘플 이미지, `sec4` 의료진 이미지 자산명 정리
- 헤더 드롭다운, 메인 비주얼, `sec2` 로고 영역의 비의미 클래스명 정리

### 2026-03-12

- 헤더 메뉴/활성 상태 정리
- `sec2` 서비스 탭 및 타이틀 인터랙션 정리
- `sec3` 카드 활성/비활성 상태 정리
- `sec4` 카피/이미지 비율 재조정
- `sec5` 피코 레이저 섹션 레이어 정리
- `sec6` 케어 카드 활성/비활성 구조 정리
- `sec7` 결과 캐러셀, 오시는 길, 푸터 구성 및 결과 API 연동 준비

## 현재 상태

- PC 시안 기준 초안 작성 완료
- 반응형 완벽 대응은 아직 아님
- MO 디자인 완료 후 별도 반영 예정

## 배포 참고

정적 사이트 구조이므로 GitHub Pages 사용이 가능합니다.  
루트 엔트리 파일은 `index.html`을 유지하는 것을 권장합니다.
