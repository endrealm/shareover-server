FROM node:18.13.0 as builder
RUN npm install -g pnpm

COPY ./pnpm-lock.yaml /work/
COPY ./package.json /work/

WORKDIR /work
RUN pnpm install

COPY ./prisma /work/

RUN pnpm run generate

COPY ./ /work
RUN pnpm run build


FROM node:18.13.0
COPY --from=builder /work/dist /app
CMD ["pnpm", "run", "migrate", "&&", "node", "/app/main.js"]
