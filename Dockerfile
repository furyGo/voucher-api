FROM node:18.16.0

ENV WORKDIR='/voucher-api'

WORKDIR $WORKDIR

ADD ./ $WORKDIR

RUN yarn
RUN yarn build

CMD yarn proc