FROM node:18-alpine

ENV WORKDIR='/voucher-api'

WORKDIR $WORKDIR

ADD ./ $WORKDIR

RUN yarn
RUN yarn build

CMD yarn proc