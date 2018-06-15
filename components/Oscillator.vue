<template>
    <div class="container">
       <select v-model="waveshape" >
            <option>sine</option>
            <option>square</option>
            <option>sawtooth</option>
            <option>triangle</option>
        </select>
        <button id="btnPlay" @click="play">play</button>
		<slider  @input="changeFreq($event)" :value="frequency" min="20" max="2000" step="1"/>
    </div>
</template>

<script>
import Knob from '~/components/Knob.vue';
import Slider from '~/components/Slider.vue';

export default {
	components: {
		Knob,
		Slider,
	},
	props: ['index'], //init = {waveshape: "sine",isPlaying: false,frequency: 440}
	data: function() {
		return {
			waveshape: 'sine',
			isPlaying: false,
			frequency: 440,
		};
	},
	mounted: function() {
		this.ctx = this.$store.state.audioCtx;
		this.osc = this.ctx.createOscillator();
		this.dest = this.ctx.destination;
		this.osc.start(0);
		this.data = this.$store.state.nodes[this.index].data;
		this.comp = this.$store.state.nodes[this.index].component;

		if (this.data) {
			this.waveshape = this.data.waveshape;
			this.isPlaying = this.data.isPlaying;
			this.frequency = this.data.frequency;
		}
		this.osc.frequency.value = this.frequency;

		if (this.isPlaying) {
			console.log('shbhdbjhqbjhdbcjhb');
			this.osc.connect(this.dest);
		}
	},
	computed: {
		node: function() {
			return this.$store.state.nodes[this.index];
		},
	},
	watch: {
		waveshape: function(newVal) {
			this.osc.type = newVal;
			this.node.data.waveshape = newVal;
		},
	},
	methods: {
		play: function() {
			if (this.isPlaying) {
				this.osc.disconnect();
				this.isPlaying = false;
			} else {
				this.osc.connect(this.dest);
				this.isPlaying = true;
			}
			this.node.data.isPlaying = this.isPlaying;
		},
		changeFreq: function(evt) {
			this.osc.frequency.value = +evt.target.value;
			this.frequency = +evt.target.value;
			this.node.data.frequency = +evt.target.value;
		},
	},
	destroyed: function() {
		this.osc.disconnect();
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
#freqVal,
label {
	width: 5em;
}
.slidercontainer {
	white-space: nowrap;
	border: 1px #d3d3d3 solid;
	border-radius: 5px;
	display: flex;
	justify-content: center;
	align-content: top;
	text-align: center;
	height: 25px;
}
.slider {
	-webkit-appearance: none;
	width: 100%;
	height: 25px;
	background: #d3d3d3;
	outline: none;
	opacity: 0.7;
	border-radius: 10px;
	-webkit-transition: 0.2s;
	padding: 2px 0px 2px 0px;
	transition: opacity 0.2s;
}

.slider:hover {
	opacity: 1;
}

.slider::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	border-radius: 10px;
	width: 25px;
	height: 25px;
	background: #4caf50;
	cursor: pointer;
}

.slider::-moz-range-thumb {
	width: 25px;
	height: 25px;
	border-radius: 10px;
	background: #4caf50;
	cursor: pointer;
}
</style>

