<template>
  <div>
    <f7-block class="bg-blue-magenta no-margin-vertical padding-vertical elevation-9">
      <f7-row class="display-flex align-items-center">
        <f7-col width="50">
          <f7-link href="/">
            <img v-if="fp_logo_white" :src="fp_logo_white" alt="FacturaloPeru" width="100%" />
          </f7-link>
        </f7-col>
        <f7-col width="50" class="">
          <f7-button panel-open="right" class="text-align-right text-color-white"><i class="fas fa-bars"></i></f7-button>
        </f7-col>
      </f7-row>
    </f7-block>
    <f7-block class="bg-blue-magenta padding-vertical no-margin-vertical" v-if="title">
      <f7-row class="display-flex align-items-center">
        <f7-col width="10">
        <a class="link back text-color-white" href="/">
          <i class="fas fa-angle-left custom-icon-back-form"></i>
        </a>
        </f7-col>
        <f7-col width="80" class="text-color-white text-align-center custom-title-form">
          {{ title }}
        </f7-col>
        <f7-col width="10"></f7-col>
      </f7-row>
    </f7-block>
    <header-waves :title="title"></header-waves>
  </div>
</template>

<script>
  import logo from "assets/images/tulogo.png";
  import HeaderWaves from "./HeaderWaves.vue"

  export default {
    name: "HeaderLayout",
    props: [ "title", ],
    components: { HeaderWaves },
    data: function() {
      return {
        fp_logo_white: logo,
      };
    },
    created() {
      if(localStorage.url_logo){
        this.fp_logo_white = localStorage.url_logo
      }
    },
    mounted() {
    },
    watch: {
    },
    methods: {
    }
  }
</script>
