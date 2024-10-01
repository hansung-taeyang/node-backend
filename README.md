# Backend README

## 준비물
- [Docker](https://www.docker.com/)
- Visual Studio Code
- Node LTS 버젼(v.20)

## 개발 시작 방법

[메인 저장소](https://github.com/hansung-taeyang/precapstone-ppurio-service)를 참고하여 방금 막 클론해왔다고 가정합니다.

1. `dev` 브랜치로 체크아웃
2. `npm install`로 의존성 패키지 설치
3.  `npm run dev`로 로컬로 서버 구동
4. DB(MySQL) 구동 필요시 `docker compose -f ../compose.db.yml up -d`으로 Docker에서 DB 구동
    - `localhost:3307`로 접근 가능
5. 개발 단계용 `.env` 파일은 말하면 제공함. API 키를 넣을 수도 있기 때문에 직접 커밋하지 않음.
6. DB 스키마 생성 및 마이그레이션 시 `npm run db` 사용.
    -  4번 항목으로 DB를 먼저 가동시킨 후에 사용 가능합니다.
    - `db:generate`: 스키마를 기반으로 SQL 파일 생성
    - `db:migrate`: MySQL로 마이그레이션 실행
    - 참고: [Drizzle 스키마 생성](https://orm.drizzle.team/docs/sql-schema-declaration) 및 [Drizzle 마이그레이션](https://orm.drizzle.team/docs/migrations)

이외의 추가할 내용이 있다면 본 문서 수정 가능.

## 메모

TypeScript 코드 작성 시, **ES6 문법**에 맞추어 작성해주세요. 아래와 같습니다.

```javascript
// const lib = require("someLib"); // ❌

// export default ...인 경우
import lib from "someLib";

// export ...인 경우
import { namedStuff, type someType } from "otherLib";
```

`tsconfig.json` 설정 상, Top-level await은 사용할 수 없습니다. `(async ()=> {...})();` 와 같은 [IIFE (mdn web docs)](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)를 사용해야 합니다.

