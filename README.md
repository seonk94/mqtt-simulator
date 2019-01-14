# frontend

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## mosquitto.conf setting
- websocket setting 
```
listener 1883

listener 9001
protocol websockets
```

## Mosquitto start
1. cd C:\Program Files (x86)\mosquitto
2. mosquitto -c -v mosquitto.conf


