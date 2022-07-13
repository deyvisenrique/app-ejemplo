<template>
  <div>
    <f7-block class="bg-blue-magenta no-margin-vertical padding-vertical elevation-9">
      <f7-row class="display-flex align-items-center">
        <f7-col width="50">
          <f7-link href="/">
            <img v-if="logo" :src="logo" alt="FacturaloPeru" width="100%" style="max-height: 80px;" />
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
  import logoOficialLight from "assets/images/logo/logo-light.svg";
  import HeaderWaves from "./HeaderWaves.vue"

  export default {
    name: "HeaderLayout",
    props: [ "title", ],
    components: { HeaderWaves, logoOficialLight },
    data: function() {
      return {
        logo: logoOficialLight,
      };
    },
    created() {
      if(localStorage.url_logo){
        this.logo = localStorage.url_logo
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
