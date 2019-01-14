<template>
    <v-container grid-list-md class="container-top-border">
        <v-layout row wrap align-start justify-center>
            <v-flex xs6 id="dataSet" style="height: auto; padding:10px;">
                <div class="formHorizental">
                    <span><input type="text" class="inpText" v-model="data.host" placeholder="host" style="width: 27%;"></span>
                    <span><input type="text" class="inpText" v-model="data.port" placeholder="port" style="width: 18%;"></span>
                    <button :class="{ connect : connectOK === true , disconnect : connectOK === false }" @click="connect()" :disabled=" connectOK === true">connect</button>
                </div>
                <div class="formHorizental">
                    <span><input type="text" class="inpText" placeholder="gateway serial number" v-model="gw_sn"/></span>
                </div>
                <div class="msg-button">
                    <span v-for="msg in msgName" :key="msg">
                        <button @click="msgButtonClick(msg)"> {{msg}} </button>
                    </span>
                </div>
                <div class="formHorizental">
                    <span><input type="text" class="inpText" v-model="data.topic" placeholder="topic"></span>
                </div>
                <br>
                <div class="formHorizental" v-for="(msg, index) in jsonMsg" :key="index">
                    <div v-if="typeof msg.value == 'object'" style="padding: 10px 0px;">
                        <ul style="font-weight: bold;">{{msg.key}}</ul>
                        <button @click="pageClick('left', msg.value.length)"> left </button> <span>{{page}} / {{msg.value.length}}</span> 
                        <button @click="pageClick('right', msg.value.length)"> right </button> 
                        <button @click="pageAdd(msg.value, msg)"> add </button>
                        <button @click="pageDelete(msg.value, msg)"> delete </button>
                        <div class="intend" v-for="(deepMsg, idx) in msg.value" :key="deepMsg.tm1_sn + idx">
                            <div v-for="(deepMsgValue, deepMsgProName) in deepMsg" :key="deepMsgValue.key" v-show="page == idx + 1">
                                <span><input type="text" class="h-inpText" :value="deepMsgProName" placeholder="key"></span>
                                <span><input type="text" class="h-inpText" v-model="deepMsg[deepMsgProName]" placeholder="value"></span>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <span><input type="text" class="h-inpText" v-model="msg.key" placeholder="key"></span>
                        <span><input type="text" class="h-inpText" v-model="msg.value" placeholder="value"></span>
                        <button @click="deleteProp(index)">Delete</button>
                        <span v-show="index == jsonMsg.length - 1">
                            <button @click="addProp()" >Add</button>
                            <button @click="submit" :disabled="connectOK !== true" >Submit</button>
                        </span>
                    </div>
                </div>
                
            </v-flex>
            <v-flex xs3>
                <v-flex xs12>
                    <input v-model="setTime" />
                </v-flex>
                <v-flex xs12>
                    <button @click="sendStart" :disabled=" CanStart !== true">Start</button>
                    <button @click="sendStop">Stop</button>
                    <button @click="randomValue(jsonMsg)">Random</button>
                </v-flex>
                <h3>Publish : {{publishSuccess}}</h3>
                <PahoClient 
                    ref="pahoClient"
                    :client="data"/>
            </v-flex>

        </v-layout>
    </v-container>
</template>

<script>
    import axios from 'axios';
    import simul from './simul.js';
    import PahoClient from './PahoClient.vue'
    export default {
        name: 'MqttClient',
        props: {
            index: ''
        },
        data() {
            return {
                data: {
                    host: 'localhost',
                    port: 9001,
                    topic: '',
                    clientId: '',
                    msg: '',
                    arrMsg: []
                },
                client: {id: '', index: '', running: false},
                jsonMsg: [
                    {
                        key: '',
                        value: ''
                    }
                ],
                msgName: [
                    'gw_cert',
                    'gw_connect',
                    'server_time',
                    'm_data',
                    'unsubscribe',
                    'scan_res'
                ],
                gw_sn: '',
                connectOK: '',
                page: 1,
                interval: '',
                _timer: '',
                setTime: 500,
                temporaryArr: [],
                publishSuccess: 0
            }
        },
        created() {
            this.client.index = this.index;
            this.data.clientId = 'paho' + this.index;
        },
        computed: {
            IsTopicNotNull () {
                return this.data.topic === ''
                    ? false
                    : true
            },
            CanStart () {
                return this.IsTopicNotNull && this.connectOK === true
            }
        },
        watch: {
            'data.ip'() {
                this.connectOK = '';
            },
        },
        methods: {
            addClient() {
                this.$store.commit('ADD_MQTTCLIENT');
            },
            sendStart() {
                
                this.client.running = true;
                this.$store.commit('MODIFY_MQTTCLIENT', this.client);

                this.interval = setInterval(() => {
                    this.randomValue(this.jsonMsg);
                    this.returnTemporary();
                    this.publishSuccess++;
                }, this.setTime);

                this._timer = setInterval(() => {
                    this.data.arrMsg = this.temporaryArr;

                    axios.post(`http://localhost:8080/mqtt/send/start/${this.client.id}`, this.data)
                        .then((res) => {
                        })
                        .catch(err => {
                            console.log(err);
                        })
                    this.temporaryArr = [];
                    
                }, 250);
            },
            returnTemporary() {
                let myJson = {};
                this.jsonMsg.forEach(msg => {
                    myJson[msg.key] = msg.value
                })

                this.temporaryArr = [ ...this.temporaryArr, JSON.stringify(myJson) ]
            },
            sendStop() {
                this.client.running = false;
                this.$store.commit('MODIFY_MQTTCLIENT', this.client);
                clearInterval(this.interval);
                clearInterval(this._timer);
            },
            pageAdd(obj, arr) {

                let tempObj = {};
                Object.keys(obj[0]).forEach(item => {
                    tempObj[item] = ''
                })
                arr.value = [
                    ...arr.value, tempObj
                ]
                
            },
            pageDelete(obj, arr) {
                if(this.page == obj.length) 
                    this.page--;
                obj.pop();
            },
            pageClick(text, num) {
                if(text == 'left' && this.page > 1){
                    this.page--;
                }
                else if(text == 'right' && this.page < num) {
                    this.page++;
                }
            },
            addProp() {
                this.jsonMsg = [
                    ...this.jsonMsg, { key: '', value: ''}
                ]
            },
            deleteProp(index) {
                if(index !== 0) {
                    this.jsonMsg.splice(index, 1)
                }
            },
            connect() {
                this.$refs.pahoClient.connect();
                /* let params = new URLSearchParams();
                params.append('ip', this.data.ip);

                axios.post('http://localhost:8080/mqtt/connect', this.data)
                    .then(res => {
                        if(res.data === 'NotConnected') {
                            this.connectOK = false;
                        } else {
                            const tempClient = { id: res.data, index: this.index, running: false}
                            this.connectOK = true;
                            this.$store.commit('MODIFY_MQTTCLIENT', tempClient)
                            this.client = tempClient;
                        }
                    }) */
            },
            submitTest() {

            },
            submit() {
                if(this.data.topic.trim() == '') {
                    alert('topic을 입력하세요')
                    return;
                }
                let myJson = {};
                this.jsonMsg.forEach(msg => {
                    myJson[msg.key] = msg.value
                })

                this.data.msg = JSON.stringify(myJson)
                axios.post(`http://localhost:8080/mqtt/send/${this.client.id}`, this.data)
                    .then(res => {
                        if (typeof res.data === 'string') {
                            console.log(res.data);
                        } else {

                        }
                    })  
                    .catch(err => {
                        console.log(err);
                    })
                
            },
            msgButtonClick(msg) {
                let tempObject = simul.returnObject(msg);
                this.jsonMsg = []
                this.page = 1
                
                Object.keys(tempObject).forEach((item, index) => {
                    if(item === 'topic') {
                        tempObject[item].charAt(tempObject[item].length - 1) === '/' 
                            ? this.data.topic = tempObject[item] + this.gw_sn
                            : this.data.topic = tempObject[item]
                    } else {
                        this.jsonMsg = [
                            ...this.jsonMsg,
                            {
                                key: item,
                                value: item === 'gw1_sn'
                                    ? this.gw_sn
                                    : tempObject[item]
                            } 
                        ]
                    }
                })

            },
            randomValue(obj) {
                obj.forEach(item => {
                    
                    item.value instanceof Array
                        ?   item.value.forEach(arrItem => {
                                Object.keys(arrItem).forEach(arrKey => {
                                    arrItem[arrKey] = simul.randomValue(arrKey);
                                })
                            })
                        :   item.value = simul.randomValue(item.key)
                })
            }
            
        },
        destroyed() {
            clearInterval(this.interval);
            clearInterval(this._timer);
        },
        components: {
            PahoClient
        }
    }
</script>

<style scoped>
    .container-top-border {
        border-top: 1px solid lightgray;
        box-shadow: 0.5px 0.5px 1px rgba(0, 0, 0, 0.2);
    }
    input {
        border: none;
        border-bottom: 1px solid black;
        padding: 5px;
    }
    button:disabled {
        border:none;
        background: silver;
        color: white;
    }
    button:disabled:hover {
        background: silver;
        color: white;
        cursor: default;
    }
    button {
        border: 1px solid black;
        padding: 6px;
        margin: 5px;
        background: white;
    }
    button:hover{
        background: black;
        color: white;
        cursor: pointer;
    }
    .formHorizental {
        margin: 10px 0px;
    }
    .left {
        float: left;
        width: 50%;
        height: 100%;
    }
    .inpText {
        width: 46.5%;
    }
    .h-inpText {
        width: 22.5%;
    }
    .connect {
        background: azure;
        color: turquoise;
    }
    .disconnect {
        background: seashell;
        color: red;
    }
    .publish-list{
        overflow-y: scroll;
    }
    .msg-button {
        padding: 20px 0px;
        border-bottom: 1px solid darkgrey;
    }
    /* .msg-button>span{
        margin: 0px 5px;
    } */
    .intend{
        margin-left: 20px;
    }
    .auto-box {
        padding: 10px 0px;
    }
</style>