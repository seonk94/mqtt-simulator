<template>
  <div class="wrap">
    <!-- header : s -->
    <div id="header">
      <div id="gnb">
        <h2>MQTT Simulator</h2>  
      </div>
    </div>
    <Tabs class="tab-margin"/>
    <div class="fix-button">
      <button @click="addClient">
        <v-icon center>add_circle</v-icon>
      </button>
      <button @click="removeClient">
          <v-icon center>remove_circle</v-icon>
      </button>
    </div>
  </div>
</template>

<script>
import Tabs from './components/Tabs'
import { mapGetters } from 'vuex';
export default {
  name: 'App',
  components: {
    Tabs,
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters({
      index: 'getCurrentIndex'
    })
  },
  methods: {
    addClient() {
      this.$store.commit('ADD_MQTTCLIENT');
    },
    removeClient() {
      this.$store.dispatch('REMOVE_MQTTCLIENT', this.index);
    }
  },
}
</script>

<style>

/* Header */


@media screen and (max-width: 740px) {
  #header{position: relative;top:0;left:0;right:0;background:#fff;text-align:center;box-shadow:0 0 16px rgba(0, 0, 0, 0.45);z-index:10;}
  .tab-margin {margin-top: 5px;}
}

@media screen and (min-width: 741px) {
  #header{position:fixed;top:0;left:0;right:0;background:#fff;height:65px;text-align:center;box-shadow:0 0 16px rgba(0, 0, 0, 0.45);z-index:10;}
  #header .utilMenu{position:absolute;top:25px;right:43px;font-size:0;}
  #header .utilMenu b{display:inline-block;font-size:14px;font-weight:700;color:#888;margin-left:36px}
  #header .utilMenu input{border: none; height:20px; width:150px; border-bottom: 1px solid black; padding: 1px 5px;}
  
  #gnb h2 {margin: 17.25px;}
  .tab-margin {margin-top: 68px;}
}

/* .container {
  height: 100%;
  margin-top: 65px;
} */

.fix-button {
  position: absolute;
  right: 2%;
  top: 22%;
  width:24px;
  box-shadow:0 0 8px rgba(0, 0, 0, 0.7);
}
html,body {
    height: calc(100% - 65px);
    padding:0;
    margin:0;
}
.wrap {
  height: 100%;
}


</style>
