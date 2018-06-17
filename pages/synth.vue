<template>
    <draggable  v-model="nodelist" class="board" :options="{handle:'.myhandle'}" @start="start" @end="end"  >
      <div  v-for="i of indexes" :key="i"  class="cell" >
          <span class="myhandle">°</span>
          <node  :key="i" :index="i" />
          
      </div>
    </draggable>

</template>

<script>
import Node from '~/components/Node.vue';
import draggable from 'vuedraggable';
import Oscillator from '~/components/Oscillator.vue';
import Oscilloscope from '~/components/Oscilloscope.vue';
import Empty from '~/components/Empty.vue';

export default {
	components: {
		Node,
		Oscillator,
		Oscilloscope,
		Empty,
		draggable,
	},
	created() {
		this.$store.commit('initializeCtx');
		this.$store.commit('initializeNodes', Empty);
		this.$store.commit('addComponent', {
			component: Oscilloscope,
			index: 5,
			data: { type: 'scope' },
			dest: undefined,
			audioNode: undefined,
		});
		this.$store.commit('addComponent', {
			component: Oscillator,
			index: 2,
			data: { waveshape: 'sine', isPlaying: false, frequency: 440, gain: 50 },
			dest: undefined,
			audioNode: undefined,
		});
		this.$store.commit('addComponent', {
			component: Oscillator,
			index: 1,
			data: { waveshape: 'sine', isPlaying: false, frequency: 440, gain: 50 },
			dest: undefined,
			audioNode: undefined,
		});
		this.$store.commit('addComponent', {
			component: Oscillator,
			index: 0,
			data: { waveshape: 'sine', isPlaying: false, frequency: 440, gain: 50 },
			dest: undefined,
			audioNode: undefined,
		});
	},
	computed: {
		indexes: function() {
			return [...Array(this.$store.state.gridnodeNB).keys()];
		},
		nodelist: {
			get() {
				return this.$store.state.nodes;
			},
			set(newList) {
				this.$store.commit('setNodes', newList);
			},
		},
	},
	methods: {
		start(ev) {
			console.log('start', ev);
		},
		end(ev) {
			console.log('end', ev);
		},
	},
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
	padding: 0px 10px 10px 10px;
}
.myhandle {
	display: block;
	width: 1em;
	height: 1em;

	cursor: move;
	z-index: 1;
	cursor: -webkit-grabbing;
	margin: 2px;
}
</style>
