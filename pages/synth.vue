<template>
    <draggable element="node" v-model="nodes" class="board" @start="start" @end="end" :component-data="getComponentData()" >
      <node  v-for="i in indexes" 
                    :key="i" 
                    :comp="nodes[i]"               
                    class="cell" />
 

    </draggable>

</template>

<script>
import Node from "~/components/Node.vue";
import Oscillator from "~/components/Oscillator.vue";
import Empty from "~/components/Empty.vue";
import draggable from "vuedraggable";

export default {
  components: {
    Node,
    Oscillator,
    Empty,
    draggable
  },
  data: function() {
    return {
      nodeNB: 12,
      indexes: [],
      nodes: [
        Oscillator,
        Oscillator,
        Empty,
        Empty,
        Empty,
        Empty,
        Empty,
        Empty,
        Oscillator,
        Oscillator,
        Oscillator,
        Oscillator,
        Oscillator
      ]
    };
  },
  mounted() {
    this.indexes = [...Array(this.nodeNB).keys()];
  },
  methods: {
    getComponentData() {
      console.log("getcomp");
      return {
        on: {},
        props: {
          init: { waveshape: "square", isPlaying: true, frequency: 550 }
        }
      };
    },
    start() {
      console.log("start");
    },
    end() {
      console.log("end");
    }
    /*getComponentData(){
      init="{'waveshape': 'square','isPlaying': true,'frequency': 550}
    }*/
  }
};
</script>

<style >
.board {
  display: grid;
  grid-template-columns: repeat(4, auto);
  grid-auto-rows: calc(25vw / 1.618);
  grid-gap: 2px;
}
.cell {
  border: 1px solid black;
  padding: 10px;
}
</style>
