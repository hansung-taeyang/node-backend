# Backend README

## 준비물
- [Docker](https://www.docker.com/)
- Visual Studio Code
- Node LTS 버젼(v.20)

## 개발 시작 방법

1. [프로젝트 메인 저장소](https://github.com/hansung-taeyang/precapstone-ppurio-service)에 적힌대로 일단 클론한다.
2. `cd node-backend`
3. `git checkout dev && git pull origin dev` (**매우 중요함!!!!!**)
    - 프로젝트 메인 저장소를 클론하면 `node-backend, front-flutter` 서브 모듈 저장소는 Detached HEAD인 상태가 됨.
    - 이상한 곳에서 개발하면 안되니, `dev` 브랜치로 올바르게 Checkout 및 Pull 해 주어야함.
4. `npm install`로 패키지 설치
5. Docker 켜기
6. `docker compose -f ../compose.db.yml up -d`로 `db`라는 이름의 MySQL 컨테이너 실행
7. `npx drizzle-kit migrate`로 MySQL에 실제 테이블 생성
    - 이때, 현재 저장소 폴더에 `drizzle`이라는 폴더가 없다면, `npx drizzle-kit generate`를 실행하고 7번 다시 실행.
8. `npm run dev`로 Node.js 백엔드 서버 구동

## 자주 묻는 질문 

VS Code에서 현재 저장소(`node-backend`)를 폴더로 열었다고 가정합니다.

### DB 마이그레이션만 다시 하는 법

1. [DB 컨테이너 다시 만들거나](#nodejs-로그에-mysql-어쩌구저쩌구-오류-뜸)
2. `docker exec -it db mysql -u root -p`로 MySQL 컨테이너에 직접 접속한다.
    - `root` 로 비밀번호를 입력한다.
    - `drop database capstonedb;` 하고 `create database capstonedb;`로 데이터베이스를 다시 만든다.
    - `npx drizzle-kit migrate`로 DB 마이그레이션 다시 해서 샘플 데이터를 다시 넣으면 된다.
    - 뭔 소리인지 모르겠으면 [DB 컨테이너 다시 만들면 됨.](#nodejs-로그에-mysql-어쩌구저쩌구-오류-뜸)

### Node.js 서버 돌릴려니깐 무슨 `import`를 찾을 수 없다고 나옴

다른 팀원이 개발하면서 새로운 npm 패키지를 추가하고, 이를 커밋/푸시한 모양입니다.

변경사항을 `git pull` 했다면, `npm i` 혹은 `npm install`로 새로운 패키지들을 설치해줍시다.

### DB 실행 어떻게 함?

1. Docker를 켜둔다.
2. 터미널을 연다. (VS Code에서는 단축키 `` ctrl+shift+` ``)
3. `docker compose -f ../compose.db.yml up -d` 실행
    - DB 컨테이너를 만드는데, `compose.db.yml` 스크립트를 참고하여 컨테이너를 생성하고, 컨테이너를 실행한다는 뜻
    - 잘 실행되었다면, Docker Desktop의 `Containers`에 `ppurio-service/db`의 컨테이너가 생성되어 돌고 있다.
4. `npx drizzle-kit migrate` 실행
    - `drizzle` 폴더 안에 만들어져있는 `.sql` 파일들을 돌려서 테이블 생성 및 샘플 데이터 삽입함.
5. `npx drizzle-kit studio`로 크롬창에서 DB를 볼 수 있다.
    - MySQL 클라이언트 따로 쓸거면 그렇게 해도 됨.
    - 터미널에서 `docker exec -it db sh`로 `db` 컨테이너에 직접 쉘 열어서 `mysql -u root -p`로 실행해도 됨.

### Node.js 로그에 MySQL 어쩌구저쩌구 오류 뜸

일단 Docker를 켜놨는가?? 켜져있었는데 오류가 났다면, DB 컨테이너를 다시 만들어보자. 아래에 과정이 적혀있다.

1. Docker Desktop을 열어서, `Containers`에서 `db` 컨테이너를 제거한다. 못 지우면 일단 정지시키고 지워본다.
2. Docker Desktop에서 `Volumes`로 들어가서 `db_data` 볼륨을 제거한다.
3. `node-backend` 폴더 (현재 이 저장소)에서 터미널을 연다.
4. `docker compose -f ../compose.db.yml up -d`를 실행
5. `npx drizzle-kit migrate` 실행
6. `npm run dev`로 Node.js 백엔드 다시 켜서 잘 되는지 확인.

---

참고: Docker 컨테이너, 볼륨 지우는건 아래의 명령으로도 가능함. 아래에 있는 경로명은 당연히 내 것과 다르니 참고.

아래의 과정을 마치고 위의 5,6번을 다시 한다.

작업 폴더는 `node-backend`를 기준으로 설명함.

```console
$ docker ps 
CONTAINER ID   IMAGE       COMMAND                   CREATED          STATUS          PORTS                               NAMES
ee446243a701   mysql:lts   "docker-entrypoint.s…"   16 minutes ago   Up 16 minutes   33060/tcp, 0.0.0.0:3307->3306/tcp   db

$ docker stop db
db

$ docker rm db
db

$ docker volume rm db_data
db_data

$ docker compose -f ../compose.db.yml up -d
[+] Running 2/2
 ✔ Volume "db_data"  Created
 ✔ Container db      Started
```

각각의 명령은 다음을 의미함.

1. 실행 중인 DB 컨테이너 이름이 `db`가 맞는지 확인.
2. `db` 컨테이너 정지
3. `db` 컨테이너 제거
4. `db_data` 볼륨 제거
5. `db` 컨테이너 재시작

### Node.js 백엔드 실행이 안됨

Node.js 로그에 포트 어쩌구저쩌구(주로 포트 번호가 이미 사용 중인 경우)라고 뜰 때가 있다.

`.env`파일에 `EXPRESS_PORT=3000`에서 포트번호를 임의로 바꿔도 괜찮으니 적당한 포트로 바꾼다. 그리고 `npm run dev`로 다시 서버를 켜본다.

그래도 포트 번호가 사용 중이니 뭐니 그러면 `netstat -ano` 커맨드로 사용 중인 포트 번호의 PID를 알아낼 수 있으니 그 프로세스를 죽이던지, 컴퓨터를 재부팅해보자.

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

