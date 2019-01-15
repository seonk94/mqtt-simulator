<template>
    <div>
        <h3>{{subscribes}} / {{publishs}}</h3>
    </div>
</template>

<script>
    import Paho from 'paho-mqtt';
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
                subscribes: 0
            }
        },
        created() {

        },
        methods: {
            connect(data) {
                this.pahoClient = new Paho.Client(data.host, Number(data.port), data.clientId);
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
                this.publishs++;
            },
            onMessageArrived(msg) {
                this.subscribes++;
            }
        }
    }
</script>

<style scoped>

</style>