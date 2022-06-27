<template>
  <f7-block :class="clases">
    <img
      :src="require('src/assets/images/icons/'+nameIcon+'.svg')"
      class="icon-svg"
      :width="widthIcon"
    />
    <!-- {{require('src/assets/images/icons/'+nameIcon+'.svg')}} -->
  </f7-block>
</template>

<script>
export default {
  name: "BaseIcon",
  props: ["nameIcon", "clases", "widthIcon"],
}
</script>

<style>

</style>