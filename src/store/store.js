import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { stat } from 'fs';

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        mqttClient: [
            {
                index: 0,
                id: '',
                running: false
            }
        ],
        currentIndex: 0,
        tempNum: 0
    },
    getters: {
        getMqttClient(state) {
            return state.mqttClient;
        },
        getMqttClientByIndex(state, index) {
            return state.mqttClient.filter(client => client.index === index);
        },
        getCurrentIndex(state) {
            return state.currentIndex;
        }
    },
    mutations: {
        ADD_MQTTCLIENT(state){
            state.mqttClient = [
                ...state.mqttClient, { index: ++state.tempNum, id: '' }
            ]
        },
        REMOVE_MQTTCLIENT(state, index) {
            state.mqttClient = state.mqttClient.filter(client => client.index !== index);
            state.currentIndex = state.mqttClient[state.mqttClient.length - 1].index;
        },
        MODIFY_MQTTCLIENT(state, client) {
            const findIndex = state.mqttClient.findIndex( item => item.index === client.index);
            state.mqttClient[findIndex] = client
        },
        MODIFY_CURRENTINDEX(state, index) {
            state.currentIndex = index;
        }
    },
    actions: {
        REMOVE_MQTTCLIENT({commit, state}, index) {
            if(index === 0) {
                return;
            }
            const client = state.mqttClient[state.mqttClient.findIndex(item => item.index === index)]
            if(client.id != '') {
                axios.post(`http://localhost:8080/mqtt/remove/${client.id}`) 
                    .then(res => {

                    })
                    .catch(err => {
                        console.log(err);
                    })

            }
            commit('REMOVE_MQTTCLIENT', index);
        }
    }

});