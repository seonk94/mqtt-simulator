# frontend

> A Vue.js project for MQTT simulator
> Using paho client

## mosquitto.conf setting
- add mosquitto.conf last
```
listener 1883

listener 9001
protocol websockets
```

## Mosquitto start
1. cd C:\Program Files (x86)\mosquitto
2. mosquitto -c -v mosquitto.conf

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8081
npm start

# build for production with minification
npm run build

# mocha test
mocha

# json-server start
cd test
json-server --watch db.json
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).



