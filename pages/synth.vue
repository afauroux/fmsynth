<template>
    <div class="board">
      <oscillator v-for="node in nodes" :key="node.key" class="cell"/>

    </div>
</template>

<script>
import Oscillator from '~/components/Oscillator.vue';
export default {
	components: {
		Oscillator,
	},
	data: function() {
		return { nodes: [{ key: 1 }, { key: 2 }, { key: 3 }, { key: 4 }, { key: 5 }] };
	},
};
</script>

<style >
.board {
	display: grid;
	grid-template-columns: repeat(6, auto);
	grid-auto-rows: 20vh;
	grid-gap: 2px;
}
.cell {
	border: 1px solid black;
}
</style>
