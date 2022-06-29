<template>
  <f7-block :class="clases">
    <img
      :src="require('src/assets/images/icons/'+nameIcon+'.svg')"
      class="icon-svg"
      :width="widthIcon"
    />
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