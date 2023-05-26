FROM node:18.13.0
RUN npm install -g pnpm

COPY ./pnpm-lock.yaml /app/
COPY ./package.json /app/

WORKDIR /app
RUN pnpm install

COPY ./ /app

CMD ["bash", "-c", "sleep 4 && pnpm run migrate && pnpm run start"]