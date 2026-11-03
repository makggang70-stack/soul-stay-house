# SOUL STAY HOUSE v0.3 검증 기록

검증일: 2026-11-03

## GitHub Actions
- Node.js 22 의존성 설치, TypeScript 검사, 단위 테스트, Vite production build, `dist/index.html` 확인: 성공
- 검사: https://github.com/makggang70-stack/soul-stay-house/actions/runs/41577521243

## 브라우저 스모크 검사 (격리된 시험 환경)
- 대상: GitHub v0.3 기준 소스와 일치하는 로컬 프로젝트
- 도구: Chromium / Playwright
- 실행 방식: TypeScript를 임시 JavaScript로 트랜스파일해 페이지에 주입. 네트워크 요청 제한으로 localhost/실주소 대신 `page.set_content`을 이용.
- 저장 확인에는 메모리 기반 localStorage 모의 객체를 사용하였고, `crypto.randomUUID`는 보안 컨텍스트가 아닌 환경을 보완하기 위해 시험용 모의 함수를 사용함.
- 검사: 첫 화면의 공간카드 3개 표시, 바닷가 집 전환, 믹서 설정 저장, 브라우저 오디오 상태 변화, 마음 기록 추가, 명상 타이머 20:00에서 19:59 변경, 390px 모바일 뷰포트 가로 넘침 없음.
- 결과: 위 스모크 시나리오 통과 / 검사 중 JavaScript 오류 없음.

## 제한 및 미검증 사항
- 실제 HTTPS 배포에서의 UI, 영속 localStorage, 브라우저 재시작 후 설정 유지 검증은 아직 하지 않음.
- 음악 장시간 재생 및 iOS Safari, Android 브라우저 동작, 실제 서버·회원 기능은 미검증.
- 현재 앱은 프로토타입이며 상업 음악 콘텐츠·실시간 공동 명상은 미연결.

## 다음 단계
- Vercel 등 배포 환경에 Preview로 배포 후 실제 URL에서 재검증.
- 공개/유료 서비스 전 음원 이용권 및 개인정보 정책 확인.
