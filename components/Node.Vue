<template>
    <component :is="comp1 ? comp1 : Empty"/>
</template>

<script>
import Oscillator from "~/components/Oscillator.vue";
import Empty from "~/components/Empty.vue";

export default {
  component: {
    Oscillator,
    Empty
  },
  data: function() {
    return { comp1: comp };
  },
  prop: ["comp"]
};
</script>
