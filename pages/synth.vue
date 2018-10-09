<template>
    <draggable  v-model="nodelist" class="board" :options="{handle:'.myhandle'}" @start="start" @end="end"  >
      <div  v-for="i of indexes" :key="i"  class="cell" >
		  
          <div class="io">
			<span class="myhandle">¨</span>

			<div  v-for="p of nodelist[i].plugs" :key="p.name"  >
				
				<div @mouseout="linkable=false" @mouseover="linkable = true" @click="linking = !linking" :name="p.name" class="tooltip plug">
					<span class="tooltiptext">{{p.name}}</span>
				</div>
				
			</div>

		  </div>
          <node  :key="i" :index="i" />
          
      </div>
	  <cable-board :linking="linking" @linked="plugged" />
    </draggable>

</template>

<script>
import Node from '~/components/Node.vue';
import draggable from 'vuedraggable';
import Oscillator from '~/components/Oscillator.vue';
import Oscilloscope from '~/components/Oscilloscope.vue';
import Empty from '~/components/Empty.vue';
import CableBoard from '~/components/CableBoard.vue';
import { mapGetters } from 'vuex';

export default {
	components: {
		Node,
		Oscillator,
		Oscilloscope,
		Empty,
		draggable,
		CableBoard,
	},
	data: function() {
		return {
			linking: false,
			linkable: false,
		};
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
			plugs: [{ name: 'in', name: 'out' }],
		});
		this.$store.commit('addComponent', {
			component: Oscillator,
			index: 2,
			data: { waveshape: 'sine', isPlaying: false, frequency: 440, gain: 50 },
			dest: undefined,
			audioNode: undefined,
			plugs: [{ name: 'in', name: 'out' }],
		});
		this.$store.commit('addComponent', {
			component: Oscillator,
			index: 1,
			data: { waveshape: 'sine', isPlaying: false, frequency: 440, gain: 50 },
			dest: undefined,
			audioNode: undefined,
			plugs: [{ name: 'in', name: 'out' }],
		});
		this.$store.commit('addComponent', {
			component: Oscillator,
			index: 0,
			data: { waveshape: 'sine', isPlaying: false, frequency: 440, gain: 50 },
			dest: undefined,
			audioNode: undefined,
			plugs: [{ name: 'in', name: 'out' }],
		});
	},
	computed: {
		indexes: function() {
			return [...Array(this.$store.state.gridnodeNB).keys()];
		},
		nodelist: {
			get() {
				return this.getNodes();
			},
			set(newList) {
				this.$store.commit('setNodes', newList);
			},
		},
	},
	methods: {
		...mapGetters(['getNodes']),
		plugged(ev) {
			if (!this.linkable) {
				console.log('not linkable');
			} else {
				console.log('linkable');
			}
		},
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
.io {
	display: flex;
	justify-content: flex-start;
}

.board {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
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
.plug {
	background-color: black;
	border-color: gray;
	width: 10px;
	height: 10px;
	margin: 2px;
	border-radius: 50%;
	border: 2px gray solid;
}

.tooltip {
	position: relative;
	display: inline-block;
	border-bottom: 1px dotted black;
}

.tooltip .tooltiptext {
	visibility: hidden;
	width: 120px;
	background-color: black;
	color: #fff;
	text-align: center;
	border-radius: 6px;
	padding: 5px 0;
	position: absolute;
	z-index: 1;
	top: 150%;
	left: 50%;
	margin-left: -60px;
}

.tooltip .tooltiptext::after {
	content: '';
	position: absolute;
	bottom: 100%;
	left: 50%;
	margin-left: -5px;
	border-width: 5px;
	border-style: solid;
	border-color: transparent transparent black transparent;
}

.tooltip:hover .tooltiptext {
	visibility: visible;
}
</style>
