# 安装Node.js
FROM node:20-alpine3.17 as build

RUN apk update \
  && apk --no-cache add tzdata
WORKDIR /app
COPY . /app

RUN npm install -g pnpm@8.15.5 \
    && pnpm install \
    && pnpm run build

FROM nginx:stable-alpine
COPY --from=build /usr/share/zoneinfo /usr/share/zoneinfo
COPY --from=build /app/dist /usr/share/nginx/html/
# COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY ./docker/nginx.conf /etc/nginx/conf.d/
ENV TZ=Asia/Shanghai
EXPOSE 8080
CMD ["nginx","-g","daemon off;"]

