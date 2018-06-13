<template>
    <component :is="comp" :init="init"/>
</template>

<script>
/*import Oscillator from "~/components/Oscillator.vue";
import Empty from "~/components/Empty.vue";
*/
export default {
  /*component: {
    Oscillator,
    Empty
  },*/
  name: "node",
  props: ["comp", "init"],
  data: function() {
    return {};
  },
  mounted() {
    console.log("test", this.init);
  }
};
</script>
