<template>
    <canvas ref="canvas" :class="{pointable : linking, notpointable: !linking}"></canvas>

</template>

<script>
class Cable {
	constructor(ctx, start, end) {
		this.start = start;
		this.end = end;
		this.ctx = ctx;
	}
	draw() {
		let w = 60;

		this.ctx.strokeStyle = 'rgba(5,5,5)';
		this.ctx.lineWidth = 5;

		this.ctx.beginPath();
		this.ctx.moveTo(this.start.x, this.start.y);
		this.ctx.bezierCurveTo(this.start.x, this.start.y + w, this.end.x, this.end.y + w, this.end.x, this.end.y);
		this.ctx.stroke();
	}
}

export default {
	props: ['linking'],
	data: function() {
		return {
			pressed: false,
			cables: [],
			linkable: false,
		};
	},
	watch: {
		linking() {
			console.log('linking', this.$refs.canvas.style.pointerEvents);
		},
	},
	mounted() {
		this.canvas = this.$refs.canvas;
		this.ctx = this.canvas.getContext('2d');
		this.ctx.canvas.width = window.innerWidth;
		this.ctx.canvas.height = window.innerHeight;

		this.canvas.onmousedown = this.onmousedown;
		this.canvas.onmouseup = this.onmouseup;
		this.canvas.onmousemove = this.onmousemove;

		this.redraw();
	},
	methods: {
		onmousemove(event) {
			if (this.pressed) {
				let coord = this.getMousePos(event);
				//console.log(coord);
				this.cables[this.cables.length - 1].end = coord;
			}
		},
		onmouseup(event) {
			this.pressed = false;
			let coord = this.getMousePos(event);
			console.log(this);

			this.$emit('linked', coord);
			//console.log(cables)
		},
		onmousedown(event) {
			this.pressed = true;
			//console.log('pressed');
			let coord = this.getMousePos(event);
			this.cables.push(new Cable(this.ctx, coord, coord));
		},
		getMousePos(event) {
			var rect = this.canvas.getBoundingClientRect();
			let coord = {
				x: event.clientX - rect.left,
				y: event.clientY - rect.top,
			};
			return coord;
		},
		redraw() {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.cables.forEach(c => c.draw());
			window.requestAnimationFrame(this.redraw);
		},
		linked(endPos) {},
	},
};
</script>


<style scoped>
canvas {
	position: absolute;
	top: 0;
	bottom: 0;
	z-index: 1;
	width: 100vw;
	height: 100vh;
	/*background-color: rgba(240, 255, 255, 0.3);*/
}
.pointable {
	pointer-events: all;
}
.notpointable {
	pointer-events: none;
}
</style>
