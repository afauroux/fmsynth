<template>
    <div class="slidercontainer" >
		<label for="slide">{{name+": "}}</label>
		<input class="slider" id="slide" type="range" @input="$emit('input',$event)" :value="value"  :max="max" :min="min" :step="step" />
		<input type="number" id="slideVal" :value="value" @input="$emit('input',$event)" :max="max" :min="min" /> 
	</div>
</template>

<script>
export default {
	props: ['value', 'min', 'max', 'step', 'name'],
	data: function() {
		return {};
	},
};
</script>


<style>
#slideVal,
label {
	width: 8em;
}
.slidercontainer {
	white-space: nowrap;
	border: 1px #d3d3d3 solid;
	border-radius: 5px;
	display: flex;
	justify-content: space-around;
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


