# Node.js v20.16.0 이미지 사용
FROM node:20.16.0

# 작업 디렉토리 설정
WORKDIR /app

# 시간대 설정
ENV TZ=Asia/Seoul

# package.json과 package-lock.json 복사
COPY package.json package-lock.json* ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

# serve 패키지 글로벌 설치
RUN npm install -g serve

# 애플리케이션을 serve로 서빙
CMD ["serve", "-s", "dist", "-l", "5173"]

# 컨테이너의 포트 노출
EXPOSE 5173
