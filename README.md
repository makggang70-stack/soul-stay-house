# SOUL STAY HOUSE

종교와 무관한 온라인 명상의 집.

## 개발 실행

```bash
npm install
npm run dev
```

## 빌드 및 검사

```bash
npm run typecheck
npm run test
npm run build
```

## 주요 구조
- `src/main.ts`: 단일 페이지 라우팅, UI 연결, 명상 타이머
- `src/audio/engine.ts`: 브라우저에서 직접 생성한 음향과 3채널 믹서
- `src/journal/model.ts`: 기록 검증 및 HTML 이스케이프
- `src/utils/storage.ts`: 안전한 브라우저 로컬 저장
- `tests/`: 순수 로직 테스트

## 주의
- 사운드는 라이선스를 확보한 피아노 녹음이 아니라 합성된 음색·잡음입니다.
- 마음 기록은 서버 동기화/암호화가 아닌 **현재 브라우저 localStorage**에 저장됩니다. 공용 PC 사용을 권하지 않습니다.
- 공동 명상은 개인용 타이머이며 다른 이용자와 연결되지 않습니다.
- 기기·브라우저 절전 정책으로 24시간 오디오가 보장되지는 않습니다.
- `soul-stay-garden` 프로젝트는 별도이며 변경 대상이 아닙니다.
