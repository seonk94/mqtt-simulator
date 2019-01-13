<template>
    <div class="right">
        <div>
            <input v-model="hostname">
            <button :class="{ connect : connected === true , disconnect : connected === false }" @click="connectMqtt" :disabled="connected === true">connect</button>
            <button @click="disconnectMqtt" :disabled="connected === false">disconnect</button>
        </div>
        <br/>
        <div>
            <input placeholder="subscribe" v-model="subscribeName">
            <button @click="subscribe" :disabled="connected === false">subscribe</button>
        </div>
        <h3>Subscribe</h3>
        <div class="subList">
            <li v-for="sub in subscribeList" :key="sub.id"  @click="openMsg(sub)" :class="{openImg : sub.open === true}">
            <span>{{sub.topic}} ( {{sub.msg.length}} ) </span> 
            <button @click="unsubscribe(sub.topic)">delete</button>
            <div v-if="sub.msg.length > 0 && sub.open">
                    <ul v-for="(msg, index) in sub.msg" :key="index">
                        <dt>
                            <pre>
                                {{msg | pretty}}
                            </pre>
                        </dt>
                    </ul>
                </div>
            </li>
        </div>
    </div>
</template>

<script>
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import axios from 'axios';

export default {
    name: 'RightPage',

    data() {
        return {
            connected: false,
            subscribeName: '',
            hostname: "tcp://localhost:1883",
            subscription: {},
            tickMsg: '',
            subscribeList: [],
        }
    },

    filters : {
        pretty : function (value) {
            return JSON.stringify(JSON.parse(value), null, 2);
        }
    },

    created() {
        this.socket = new SockJS("http://localhost:8080/websockethandler");
        this.stompClient = Stomp.over(this.socket);
        
        this.stompClient.connect(
            {},
            frame => {
                let subscription = this.stompClient.subscribe("/espid/test", tick => {
                    this.tickMsg = JSON.parse(tick.body);
                    this.tickMsg = {
                        ...this.tickMsg, msg: this.tickMsg.msg
                    }
                    
                    this.subscribeList.forEach((remsg) => {
                        if(remsg.topic === this.tickMsg.topic) {
                            remsg.msg = [this.tickMsg.msg, ...remsg.msg]
                            return;
                        }
                    })
                })
                this.subscription = subscription;
            },
            error => {
                console.log(error);
                this.connected = false;
            }
        )
    },

    mounted() {
        axios.post("/mqtt/isConnected", {

        }).then((response) => {

            if (response.headers.isconnected == "connected") {
                
                response.data.forEach(sub => {
                    this.subscribeList = [
                        ...this.subscribeList, this.getTempMsg(sub)
                    ]
                })
                this.connected = true;
            } else {
                this.connected = false;
            }
        }).catch((error) => {
            console.log(error);
        });
    },

    methods : {
        openMsg(sub) {
            sub.open = !sub.open
        },

        connectMqtt : function () {
            let params = new URLSearchParams();
            params.append("hostname", this.hostname);
            axios.post('/mqtt/connectSub', params, {

            }).then((response) => {
                if (response.data === "OK") {
                    this.connected = true;
                    this.subscribeList = [];
                } else {
                    this.connected = false;
                }
            }).catch((error) => {
                console.log(error);
            });
        },

        disconnectMqtt : function () {
            axios.post('/mqtt/disconnectSub', {

            }).then((response) => {
                if (response.data == "OK") {
                    this.connected = false;
                }
            }).catch((error) => {
                console.log(error);
            });
        },

        subscribe : function () {
            if (this.subscribeName.length > 0 && this.subscribeName.trim().length > 0) {

                let v = this.subscribeList.findIndex(sub => sub.topic === this.subscribeName)
                if(v >= 0) {
                    alert('이미 구독중입니다.')
                    return;
                }

                let params = new URLSearchParams();
                params.append("subscribeName", this.subscribeName);
                axios.post('/mqtt/subscribe', params, {
    
                }).then((response) => {
                    if (response.data == "OK") {

                        this.subscribeList = [
                            ...this.subscribeList, this.getTempMsg(this.subscribeName)
                        ]
                        this.subscribeName = "";
                    }
                }).catch((error) => {
                    console.log(error);
                });
            } else {
                alert("토픽입력하셈");
            }
        },

        unsubscribe : function (subscription) {
            let params = new URLSearchParams();
            params.append("subscribeName", subscription);
            axios.post('/mqtt/unsubscribe', params, {

            }).then((response) => {
                if (response.data == "OK") {
                    this.subscribeList = this.subscribeList.filter(item => item.topic !== subscription);
                }
            }).catch((error) => {
                console.log(error);
            });
        },

        getTempMsg : (topic) => {
            let tempMsg = {
                topic: topic,
                msg: [],
                open: false
            }
            return tempMsg;
        }
    },

    destroyed() {
        this.connected = false;
    },

    
}
</script>

<style scoped>
    .right {float: right;width: 50%;}
    .right button{width: 80px; background-color: white;}
    .right button:hover{background-color: black; color: white;}

    .connect {background: aquamarine;}
    .disconnect {background: lightpink;}
    .openImg{background: url(../assets/images/ico_msg_arr_up.png) left no-repeat !important; padding:15px !important; display:block !important; font-size:16px;line-height:18px; background-position-y: 21px !important;}

    ::-webkit-scrollbar {width: 15px;}
    ::-webkit-scrollbar-track {box-shadow: inset 0 0 5px grey; border-radius: 10px;}
    ::-webkit-scrollbar-thumb {background: #3caeefd8;box-shadow: inset 0 0 15px lightcyan;border-radius: 10px;}
    ::-webkit-scrollbar-thumb:hover {background: #2a81b3d8;}

    .subList{border-top:1px solid #f4f4f4; padding: 15px; overflow-y: scroll; overflow-x: scroll; height: 66vh; overflow: auto; }
    .subList li{border-bottom:1px solid #4f8997;background: url(../assets/images/ico_msg_arr.png) left no-repeat; color:#222;  padding:15px; display:block;font-size:16px;line-height:18px; background-position-y: 21px;}
    .subList span{margin-left: 15px;}
    .subList button{float: right;}
    .subList div ul{position:relative; border-bottom: 1px solid #f0f0f0;}
    .subList div ul dt{padding-right:17px;border-bottom:1px solid #f4f4f4; display:inline-block;vertical-align:top;font-weight:70; }


</style>