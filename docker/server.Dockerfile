FROM node:18.13.0 as builder

COPY ./frontend /work

WORKDIR /work
RUN yarn install
RUN yarn run build

FROM nginx:alpine
COPY --from=builder /work/dist /usr/share/nginx/html
