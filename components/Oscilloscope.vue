<template>
  <!-- Oscilloscope and Spectrum annalyser stolen from width=400 height=200https://codepen.io/ContemporaryInsanity/pen/Mwvqpb-->
  <div class="container">
    <button @click="type = type == 'scope' ? 'spectrum' : 'scope'">{{type == 'scope' ? 'w' :'f'}}</button>
    <canvas width=300 height=600 ref='scope'></canvas>
  </div>
</template>

<style scoped>
.container {
	display: flex;
}
canvas {
	display: block;
	width: 100%;
	height: calc(25vw / 2);
}
button {
	width: 3em;
}
</style>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
	props: ['index'],
	data: function() {
		return {
			scopeCtx: undefined,
			analyser: undefined,
			type: 'scope',
		};
	},
	mounted() {
		this.scopeCtx = this.$refs.scope.getContext('2d');
		this.analyser = this.$store.state.audioCtx.createAnalyser();
		this.draw();
		let dat = this.getNodeData()(2);
		console.log(dat);
		dat.dest = this.analyser;
		this.setNodeData({ index: 2, data: dat });
		this.setNodeAudioN({ index: this.index, audioNode: this.analyser });
		console.log('oscillo ready for connection');
		console.log(this.$store.state.nodes);
	},
	methods: {
		...mapGetters(['getNodeData']),
		...mapActions(['setNodeData', 'setNodeAudioN']),
		draw: function() {
			if (this.type == 'spectrum') {
				this.drawSpectrum(this.analyser, this.scopeCtx);
			} else {
				this.drawScope(this.analyser, this.scopeCtx);
			}

			requestAnimationFrame(this.draw);
		},

		drawSpectrum: function(analyser, ctx) {
			var width = ctx.canvas.width;
			var height = ctx.canvas.height;
			var freqData = new Uint8Array(analyser.frequencyBinCount);
			var scaling = height / 256;

			analyser.getByteFrequencyData(freqData);

			ctx.fillStyle = 'rgba(0, 20, 0, 0.1)';
			ctx.fillRect(0, 0, width, height);

			ctx.lineWidth = 2;
			ctx.strokeStyle = 'rgb(0, 200, 0)';
			ctx.beginPath();

			for (var x = 0; x < width; x++) ctx.lineTo(x, height - freqData[x] * scaling);

			ctx.stroke();
		},

		drawScope: function(analyser, ctx) {
			var width = ctx.canvas.width;
			var height = ctx.canvas.height;
			var timeData = new Uint8Array(analyser.frequencyBinCount);
			var scaling = height / 256;
			var risingEdge = 0;
			var edgeThreshold = 5;

			analyser.getByteTimeDomainData(timeData);

			ctx.fillStyle = 'rgba(0, 20, 0, 0.1)';
			ctx.fillRect(0, 0, width, height);

			ctx.lineWidth = 2;
			ctx.strokeStyle = 'rgb(0, 200, 0)';
			ctx.beginPath();

			// No buffer overrun protection
			while (timeData[risingEdge++] - 128 > 0 && risingEdge <= width);
			if (risingEdge >= width) risingEdge = 0;

			while (timeData[risingEdge++] - 128 < edgeThreshold && risingEdge <= width);
			if (risingEdge >= width) risingEdge = 0;

			for (var x = risingEdge; x < timeData.length && x - risingEdge < width; x++)
				ctx.lineTo(x - risingEdge, height - timeData[x] * scaling);

			ctx.stroke();
		},
	},
};
</script>
