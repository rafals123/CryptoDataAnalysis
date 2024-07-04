FROM node:20-alpine AS build

WORKDIR /usr/app

COPY ./package.json ./package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY ./nginx.config /etc/nginx/conf.d/default.conf

COPY --from=build /usr/app/dist ./

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]