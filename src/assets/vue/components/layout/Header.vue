<template>
  <f7-block class="bg-blue-magenta no-margin-vertical padding-vertical elevation-9">
    <f7-row class="display-flex align-items-center">
      <f7-col width="33">
        <f7-link href="/">
          <img v-if="fp_logo_white" :src="fp_logo_white" alt="FacturaloPeru" width="60%" />
        </f7-link>
      </f7-col>
      <f7-col width="33" class="text-align-right"></f7-col>
      <f7-col width="33" class="">
        <f7-button panel-open="right" class="text-align-right text-color-white"><i class="fas fa-bars"></i></f7-button>
      </f7-col>
    </f7-row>
  </f7-block>
</template>

<script>
  import logo from "assets/images/tulogo.png";

  export default {
    data: function() {
      return {
        fp_logo_white: logo,
      };
    },
    created() {
    },
    mounted() {
    },
    watch: {
    },
    methods: {
    }
  }
</script>
