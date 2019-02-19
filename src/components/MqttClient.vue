<template>
    <v-container grid-list-md class="container-top-border">
        <v-layout row wrap align-start justify-center>
            <v-flex xs6 id="dataSet" style="height: auto; padding:10px;">
                <div class="formHorizental">
                    <span><input type="text" class="inpText" v-model="inputData.host" placeholder="host" style="width: 27%;"></span>
                    <span><input type="text" class="inpText" v-model="inputData.port" placeholder="port" style="width: 18%;"></span>
                    <!-- <button :class="{ connect : connectOK === true , disconnect : connectOK === false }" @click="connect()" :disabled="connectOK === true">connect</button>
                    <button @click="disconnectClient" :disabled="connectOK !== true">disconnect</button> -->
                </div>
                <div class="formHorizental">
                    <span><input type="text" class="inpText" v-model="inputData.username" placeholder="username" style="width: 27%;"></span>
                    <span><input type="password" class="inpText" v-model="inputData.pw" placeholder="password" style="width: 18%;"></span>
                    <button :class="{ connect : connectOK === true , disconnect : connectOK === false }" @click="connect()" :disabled="connectOK === true">connect</button>
                    <button @click="disconnectClient" :disabled="connectOK !== true">disconnect</button>
                </div>

                <div class="msg-button">
                    <span v-for="msg in msgName" :key="msg">
                        <button @click="msgButtonClick(msg)"> {{msg}} </button>
                    </span>
                </div>
                <div class="formHorizental">
                    <span><input type="text" class="inpText" v-model="topic" placeholder="topic"></span>
                </div>
                <br>
                <div class="formHorizental" v-for="(msg, index) in jsonMsg" :key="index">
                    <div v-if="typeof msg.value == 'object'" style="padding: 10px 0px;">
                        <ul style="font-weight: bold;">
                            <span><input type="text" class="h-inpText" v-model="msg.key" placeholder="key"></span>
                            <span v-show="index == jsonMsg.length - 1">
                            <button @click="addProp()" >Add</button>
                        </span>
                        </ul>
                        <button @click="pageClick('left', msg.value.length)"> left </button> <span>{{page}} / {{msg.value.length}}</span> 
                        <button @click="pageClick('right', msg.value.length)"> right </button> 
                        <button @click="pageAdd(msg.value, msg)"> add </button>
                        <button @click="pageDelete(msg.value, msg)"> delete </button>
                        <div class="intend" v-for="(deepMsg, idx) in msg.value" :key="deepMsg.tm1_sn + idx">
                            <div v-for="(deepMsgValue, deepMsgProName, i) in deepMsg" :key="deepMsgValue.key" v-show="page == idx + 1">
                                <span><input type="text" class="h-inpText" :value="deepMsgProName" @change="deepKeyChange($event, index, i, deepMsgValue)" placeholder="key"></span>
                                <span><input type="text" class="h-inpText" v-model="deepMsg[deepMsgProName]" placeholder="value"></span>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <span><input type="text" class="h-inpText" v-model="msg.key" placeholder="key"></span>
                        <span><input type="text" class="h-inpText" v-model="msg.value" placeholder="value"></span>
                        <button @click="deleteProp(index)">Delete</button>
                        <button @click="deepProp(index)">Deep</button>
                        <span v-show="index == jsonMsg.length - 1">
                            <button @click="addProp()" >Add</button>
                            <button @click="submit" :disabled="connectOK !== true" >Submit</button>
                        </span>
                    </div>
                </div>
                
            </v-flex>
            <v-flex xs3>
                <v-flex xs12>
                    <input class="ms-input" v-model="setTime" /> m/s
                </v-flex>
                <v-flex xs12>
                    <button @click="sendStart" :disabled=" CANSTART !== true">Start</button>
                    <button @click="sendStop">Stop</button>
                    <button @click="randomValue(jsonMsg)">Random</button>
                </v-flex>
                <PahoClient 
                    ref="pahoClient"
                    :client="client(index)"
                    @is-connect="IsConnect"/>
            </v-flex>

        </v-layout>
    </v-container>
</template>

<script>
    import axios from 'axios';
    import simul from './simul.js';
    import PahoClient from './PahoClient.vue'
    import Paho from 'paho-mqtt';
    import { mapGetters } from 'vuex';
    export default {
        name: 'MqttClient',
        props: {
            index: ''
        },
        data() {
            return {
                data: {
                    topic: '',
                },
                topic: '',
                inputData: {
                    host: 'localhost',
                    port: 9001,
                    clientId: '',
                    username: '',
                    pw: ''
                },
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
                    'scan_res',
                    'tm1_connect_req',
                    'tm1_disconnect_req',
                    'tm1_config',
                    'gw1_config',
                    'tm1_warn',
                    'ack_server',
                    'ack_gw'
                ],
                connectOK: '',
                page: 1,
                interval: '',
                _timer: '',
                setTime: 500,
                pahoClient: function(){}
            }
        },
        created() {
            this.inputData.clientId = 'paho' + this.index;
        },
        computed: {
            ISTOPICNOTNULL () {
                return this.topic === ''
                    ? false
                    : true
            },
            CANSTART () {
                return this.ISTOPICNOTNULL && this.connectOK === true
            },
            ...mapGetters({
                client: 'getMqttClientByIndex'
            })
            
        },
        watch: {
            'inputData.host'() {
                this.connectOK = '';
            },
            'inputData.port'() {
                this.connectOK = '';
            }
        },
        methods: {
            IsConnect(pahoClient) {
                this.connectOK = true
                this.pahoClient = pahoClient;
            },
            sendStart() {
                this.randomValue(this.jsonMsg);
                let tempClient = { ...this.client(this.index), running: true}
                this.$store.commit('MODIFY_MQTTCLIENT', tempClient);
                this.pahoClient.subscribe(this.topic)
                this.interval = setInterval(() => {

                    
                    let myJson = {};
                    this.jsonMsg.forEach(msg => {
                        myJson[msg.key] = msg.value
                    })
                    let pahoMsg = new Paho.Message(JSON.stringify(myJson))
                    pahoMsg.startTime = (new Date()).getTime();
                    pahoMsg.destinationName = this.topic
                    this.pahoClient.send(pahoMsg);
                    this.randomValue(this.jsonMsg);
                }, this.setTime);

            },

            sendStop() {
                if(typeof this.interval == 'number') {
                    clearInterval(this.interval);
                    clearInterval(this._timer);
                    this.pahoClient.unsubscribe(this.topic);
                    let tempClient = { ...this.client(this.index), running: false}
                    this.$store.commit('MODIFY_MQTTCLIENT', tempClient);
                }
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
                this.$refs.pahoClient.connect(this.inputData);
            },
            disconnectClient() {
                this.pahoClient.disconnect();
                this.connectOK = '';
            },
            submit() {
                if(this.topic.trim() == '') {
                    alert('topic을 입력하세요')
                    return;
                }
                let myJson = {};
                this.jsonMsg.forEach(msg => {
                    myJson[msg.key] = msg.value
                })

                let pahoMsg = new Paho.Message(JSON.stringify(myJson))
                pahoMsg.destinationName = this.topic
                this.pahoClient.subscribe(this.topic);
                this.pahoClient.send(pahoMsg);
                this.pahoClient.unsubscribe(this.topic);

                
            },
            msgButtonClick(msg) {
                let tempObject = simul.returnObject(msg);
                this.jsonMsg = []
                this.page = 1
                
                Object.keys(tempObject).forEach((item, index) => {
                    if(item === 'topic') {
                        tempObject[item].charAt(tempObject[item].length - 1) === '/' 
                            ? this.topic = tempObject[item] + this.gw_sn
                            : this.topic = tempObject[item]
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
            },
            deepProp(index) {
                this.jsonMsg[index].value = [ {key: 'value'} ]
            
            },
            deepKeyChange(e, index, di, value) {
                let temp = {};
                temp[e.target.value] = value
                this.jsonMsg[index].value[di] = temp;
            }
            
        },
        destroyed() {
            clearInterval(this.interval);
            clearInterval(this._timer);
            if(this.connectOK)
                this.disconnectClient();
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
    .ms-input{
        width:100px;
        text-align:right;
    }
</style>