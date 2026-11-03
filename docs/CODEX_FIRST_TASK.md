# Codex 첫 개발 작업

대상 저장소 `makggang70-stack/soul-stay-house`.
기존 기능을 깨지 말고 차근차근 타입스크립트로 전환하세요.

1. `README.md` 및 `AGENTS.md` 확인.
2. `script.js`의 오디오 엔진을 `src/audio/engine.ts`로 분리하고 엄격한 타입을 지정.
3. 페이지 이동 중 오디오 유지, 재생 오류 처리, 믹서 설정 저장 검증.
4. 기록장 로직을 `src/journal/`로 분리하고 입력 검증 및 삭제 검증.
5. 모바일 반응형 및 접근성 확인.
6. `npm run typecheck`, `npm run build` 실행. 가능하면 브라우저 E2E 테스트 추가.
7. 작업 결과를 새 브랜치의 Pull Request로 제출.

허가받지 않은 외부 음악 사용 금지. 실제 공동 명상 인원수 조작 금지.

## 2026-11-03 업데이트 (v0.3)
- `src/main.ts`, `src/audio/engine.ts`, `src/journal/model.ts`, `src/utils/storage.ts`로 기존 단일 스크립트를 분리했습니다.
- `tsc --noEmit` 검사와 Node 순수 로직 테스트 4건을 통과했습니다.
- 이 작업 환경에 Vite 의존성이 설치되지 않아 `npm run build`는 `vite: not found`로 종료됐습니다. 네트워크 가능한 개발환경에서 `npm install && npm run build`를 실행하십시오.
- **남은 개발:** 기기별 장시간 오디오/화면 테스트, 실제 공개 배포, 음원 라이선스 확보, 회원 서버, 실시간 공동 명상.
