FROM node:erbium
RUN yarn global add serve

WORKDIR /usr/src
COPY build build

EXPOSE 5007
HEALTHCHECK CMD wget --quiet --tries=1 --spider http://localhost:5007 || exit 1

ENV NODE_OPTIONS=--max-http-header-size=80000

ENTRYPOINT ["serve", "--single", "build", "--no-clipboard", "--listen", "5007"]
