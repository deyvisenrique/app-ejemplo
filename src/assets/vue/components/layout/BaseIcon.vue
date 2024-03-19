<template>
  <f7-block :class="clases">
    <img
      :src="require('src/assets/images/icons/'+nameIcon+'.svg')"
      class="icon-svg"
      :class="theme.class_bg_home_icon"
      :width="widthIcon"
    />
  </f7-block>
</template>

<script>

  import {general_functions} from "mixins_/general_functions"

  export default {
    mixins: [general_functions],
    name: "BaseIcon",
    props: ["nameIcon", "clases", "widthIcon"],
    data: function () {
      return {
        theme: {}
      }
    },
    created() {
      this.theme = this.getThemeSettings()
    }
  }
</script>

<style>

/* .home-icon {
    border-radius: 35%;
    text-align: center;
    padding: 10px;
}
.home-icon-white {
  background: var(--f7-color-teal);
} */
/*.home-icon-blue {
  background: var(--f7-color-gray);
}*/
</style>