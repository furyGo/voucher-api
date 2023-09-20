FROM node:17.4.0

ENV WORKDIR='/eventDecoder'

WORKDIR $WORKDIR

ADD ./ $WORKDIR

RUN yarn
RUN yarn build

CMD yarn pro