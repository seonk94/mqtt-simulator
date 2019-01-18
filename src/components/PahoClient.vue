<template>
    <div>
        <!-- <h3>{{subscribes}} / {{publishs}}</h3> -->
        <scatter-chart 
            :topicArr="topicArr" 
            :nowSeconds="nowSeconds"
        />
    </div>
</template>

<script>
    import Paho from 'paho-mqtt';
    import ScatterChart from './ScatterChart.vue'
    export default {
        name: 'PahoClient',
        props: {
            client: {
                
            }
        },
        data() {
            return {
                pahoClient: function() {},
                publishs: 0,
                subscribes: 0,
                topicArr: [],
                nowSeconds: ''
            }
        },
        created() {
            this.nowSeconds = ~~((new Date()).getTime() / 1000)
            //console.log('mylib', mylib);
        },
        methods: {
            connect(data) {
                this.pahoClient = new Paho.Client(data.host, Number(data.port), "/ws", data.clientId);
                console.log(this.pahoClient)
                this.pahoClient.onConnectLost = this.onConnectLost;
                this.pahoClient.onMessageArrived = this.onMessageArrived;
                this.pahoClient.onMessageDelivered = this.onMessageDelivered
                this.pahoClient.connect({onSuccess: this.onConnect});
            },
            onConnect() {

                let tempClient = {
                    ...this.client,
                    connecting: true,
                    host: this.pahoClient.host,
                    port: this.pahoClient.port,
                    id: this.pahoClient.clientId
                }
                this.$store.commit('MODIFY_MQTTCLIENT', tempClient);
                this.$emit('is-connect', this.pahoClient)
            },
            onConnectLost(resObject) {
                if(resObject.errorCode !== 0) {
                    console.log("onConnectionLost:"+responseObject.errorMessage);
                }
            },
            onMessageDelivered(msg) {
                let latency = (new Date()).getTime() - msg.startTime;
                let currentTime = ~~(msg.startTime / 1000)
                let filterTopic = this.topicArr.findIndex(ele => {
                    return ele.seconds == currentTime && ele.latency == latency
                })
                if(filterTopic === -1) {
                    this.topicArr = [
                        ...this.topicArr, { seconds: currentTime, topic: msg.topic, latency: latency, count: 0 }
                    ]
                } else {
                    this.topicArr[filterTopic].count++;
                }
                this.publishs++;
            },
            onMessageArrived(msg) {
            }
        },
        components: {
            ScatterChart
        }
    }
</script>

<style scoped>

</style>