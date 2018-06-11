<template>
    <div class="container">
       <select v-model="waveshape" >
            <option>sine</option>
            <option>square</option>
            <option>sawtooth</option>
            <option>triangle</option>
        </select>
        <button id="btnPlay" @click="play">play</button>
        <input type="range" @input="changeFreq($event)" :value="frequency"  max="2000" min="20"  /> 
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data: function() {
		return {
			waveshape: 'sine',
			isPlaying: false,
			frequency: 440,
		};
	},
	mounted: function() {
		this.ctx = this.$store.getters.audioCtx;
		this.osc = this.ctx.createOscillator();
		this.dest = this.ctx.destination;
		this.osc.start(0);
	},
	watch: {
		waveshape: function(newVal) {
			this.osc.type = newVal;
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
		},
		changeFreq: function(evt) {
			this.osc.frequency.value = evt.target.value;
			console.log(evt.target.value);
		},
	},
};
</script>

<style  scoped>
</style>

