FROM node:20

ARG NEXT_PUBLIC_API_URL

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn install

COPY . /app/

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
