<template>
  <f7-page class="page-red" color="white">
    <header-layout></header-layout>

    <f7-block class="bg-blue-magenta padding-vertical no-margin-vertical">
      <f7-row>
        <f7-col width="10">
          <a class="link back text-color-white">
            <i class="fas fa-angle-left"></i>
          </a>
        </f7-col>
        <f7-col width="80" class="text-color-white text-align-center">
          Reporte
        </f7-col>
        <f7-col width="10"></f7-col>
      </f7-row>
    </f7-block>
    <f7-block>
      <f7-list>
        <f7-list-item title="Total notas de venta">
          <template #after>
            <span class="text-align-right padding-right text-color-pink">
              {{general.totals.total_sale_notes}}
            </span>
          </template>
        </f7-list-item>
        <f7-list-item title="Total comprobantes">
          <template #after>
            <span class="text-align-right padding-right text-color-blue">
              {{general.totals.total_documents}}
            </span>
          </template>
        </f7-list-item>
      </f7-list>
    </f7-block>
    <f7-block class="bg-white-shade">
      <f7-row class="padding-horizontal">
        <f7-col width="70">
          <h3>Total</h3>
        </f7-col>
        <f7-col width="30">
          <h3>{{general.totals.total}}</h3>
        </f7-col>
      </f7-row>
    </f7-block>
    <f7-block class="padding-top padding-bottom">
      <f7-row class="padding-top padding-bottom">
        <f7-col class="padding-top padding-bottom">
          <x-graph-line :all-data="general.graph"></x-graph-line>
        </f7-col>
      </f7-row>
    </f7-block>

  </f7-page>
</template>

<style  scoped>
</style>

<script>
//const url = "https://demo.facturador.pro/api";
//const token = "hcTC1Up87AYr3p4D5jY1APRPwYZ7wXGxBSJL1yUwzynIIPcnyb";
import xGraphLine from "components/graph/GraphLine.vue";
import HeaderLayout from "components/layout/Header";
import { auth } from "mixins_/auth";

export default {
  components: { xGraphLine, HeaderLayout },
  mixins: [auth],
  data() {
    return {
      report: {},
      isBottom: true,
      general: {
        totals: {},
        graph: {}
      },
    };
  },
  async created() {
    await this.getData()
  },
  mounted() {},
  methods: {

    async getData()
    {
      this.$f7.preloader.show();

      let {data} = await this.$http.get(`${this.returnBaseUrl()}/report`, this.getHeaderConfig());

      this.general = data.data.general

      this.$f7.preloader.hide();

    }

  }
};
</script>
