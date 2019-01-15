<template>
  <v-tabs
    
    color="aqua"
    show-arrows
    centered
  >
    <v-tabs-slider color="black"></v-tabs-slider>

    <v-tab
      v-for="client in mqttClient"
      :class="{ onrunning : client.running === true}"
      :href="'#tab-' + client.index"
      :key="client.index"
      @click="tabClick(client.index)"
    >
      client {{ client.index }}
    </v-tab>
        

    <v-tabs-items>
      <v-tab-item
        v-for="client in mqttClient"
        :value="'tab-' + client.index"
        :key="client.index"
      >
        <MqttClient :index="client.index"/>
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>
</template>

<script>
    import MqttClient from './MqttClient.vue'
    import { mapGetters } from 'vuex';
    export default {
        name: 'Tabs',
        computed: {
            ...mapGetters({
                mqttClient: 'getMqttClient'
            })
        },
        methods: {
            addClient() {
                this.mqttClient = [
                    ...this.mqttClient, { index: this.mqttClient.length, id: '' }
                ]
            },
            tabClick(index) {
                this.$store.commit('MODIFY_CURRENTINDEX', index);
            }
        },
        components: {
            MqttClient
        }
    }
</script>

<style>
    .onrunning {
        -webkit-animation: blink 2.5s linear infinite;
    }
    @-webkit-keyframes blink {
        0% { color: green; }
        33% { color: turquoise; }
        66% { color: green; }
        100% { color: teal; }
    }
</style>