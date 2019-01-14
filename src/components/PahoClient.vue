<template>
    <div>

    </div>
</template>

<script>
    import Paho from 'paho-mqtt';
    export default {
        name: 'PahoClient',
        props: {
            client: {
                host: '',
                port: '',
                clientId: '',
                topic: ''
            }
        },
        data() {
            return {
                pahoClient: function() {}
            }
        },
        created() {
            
        },
        methods: {
            connect() {
                this.pahoClient = new Paho.Client(this.client.host, Number(this.client.port), this.client.clientId);
                this.pahoClient.onConnectLost = this.onConnectLost;
                this.pahoClient.onMessageArrived = this.onMessageArrived;
                console.log(this.pahoClient);
                return this.pahoClient.connect({onSuccess: this.onConnect});
            },
            onConnect() {
                console.log('onConnect')
                this.pahoClient.subscribe('connect');
                let msg = new Paho.Message("Connect?");
                msg.destinationName = "connect"
                this.pahoClient.send(msg);
            },
            onConnectLost(resObject) {
                if(resObject.errorCode !== 0) {
                    console.log("onConnectionLost:"+responseObject.errorMessage);
                }
            },
            onMessageArrived(msg) {
                
                console.log("onMessageArrived:"+msg.payloadString);
            }
        }
    }
</script>

<style scoped>

</style>