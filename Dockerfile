FROM node:10-stretch as builder
WORKDIR /app
ADD . .
RUN yarn install --network-timeout 100000 && yarn build-prod

FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
