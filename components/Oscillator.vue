<template>
    <div class="container">
       <select v-model="waveshape" >
            <option>sine</option>
            <option>square</option>
            <option>sawtooth</option>
            <option>triangle</option>
        </select>
        <button id="btnPlay" @click="isPlaying = !isPlaying">{{isPlaying? 'mute' : 'play'}}</button>
		<slider  @input="frequency = $event.target.value" :name="'Freq'" :value="frequency" min="20" max="2000" step="1"/>
		<slider  @input="gain = $event.target.value" :name="'Gain'" :value="gain" min="0" max="100" step="1"/>
    </div>
</template>

<script>
import Knob from '~/components/Knob.vue';
import Slider from '~/components/Slider.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
	components: {
		Knob,
		Slider,
	},
	props: ['index'], //init = {waveshape: "sine", isPlaying: false, gain: 50,frequency: 440}
	data() {
		return this.getNodeData()
	},
	mounted() {
		this.ctx = this.$store.state.audioCtx;
		this.osc = this.ctx.createOscillator();
		this.gainNode = this.ctx.createGain();
		/*if (!this.dest) {
			this.dest = this.ctx.destination; // if no destination we output to the speakers
		}*/
		this.dest = this.$store.state.nodes[5].audioNode;
		//console.log(this.dest);
		this.osc.start(0);
		this.data = this.$store.state.nodes[this.index].data;
		this.comp = this.$store.state.nodes[this.index].component;
		this.setNodePlugs({ index: this.index, plugs: { name: 'in', name: 'out' } });
		if (this.data) {
			this.waveshape = this.data.waveshape;
			this.gain = this.data.gain;
			this.frequency = this.data.frequency;
			this.isPlaying = false; //this.data.isPlaying;
		}
		this.osc.frequency.value = this.frequency;
		this.osc.connect(this.gainNode);

		if (this.isPlaying) {
			this.gainNode.connect(this.dest);
		}
	},
	computed: {
		/*dest() {
			return this.$store.state.nodes[5].audioNode ? this.$store.state.nodes[5].audioNode : this.ctx.destination;
		},*/
		node() {
			return this.$store.state.nodes[this.index];
		},
		nodeData: {
			set(val) {
				this.setNodeData(val);
			},
			get() {
				return this.getNodeData(this.index);
			},
		},
	},
	watch: {
		isPlaying(newVal) {
			let d = this.getNodeAudioN()(5);
			if (d) {
				this.dest = d;
				d.connect(this.ctx.destination);
			}

			if (newVal) {
				this.gainNode.connect(this.dest);
				console.log(this.dest);
			} else {
				this.gainNode.disconnect();
			}
			this.setNodeData(this.data);
		},
		waveshape(newVal) {
			this.osc.type = newVal;
			this.setNodeData({ index: this.index, data: this.data });
			console.log(this.data);
		},
		gain(newValue) {
			let g = newValue / 100;
			if (g) this.gainNode.gain.setValueAtTime(g, this.ctx.currentTime);
			this.setNodeData({ index: this.index, data: this.data });
		},
		frequency(newValue) {
			this.osc.frequency.value = newValue;
			this.setNodeData({ index: this.index, data: this.data });
		},
	},
	methods: {
		...mapGetters(['getNodeData', 'getNodeAudioN']),
		...mapActions(['setNodeData', 'setNodePlugs']),
		destroyed() {
			this.osc.disconnect();
			this.gainNode.disconnect();
		},
	},
};
</script>

<style  scoped>
.container {
	display: grid;
	/*flex-wrap: wrap;
  flex-basis: content;*/
	grid-auto-rows: 25px;
	grid-row-gap: 5px;
}
</style>

