FROM node:10.10.0
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install -g yarn
RUN yarn
COPY . /usr/src/app
RUN yarn build
EXPOSE 4000
CMD [ "yarn", "start" ]