<template>
    <component :is="(''+comp)" :init="init"/>
</template>

<script>
import Oscillator from '~/components/Oscillator.vue';
import Empty from '~/components/Empty.vue';
import { mapGetters } from 'vuex';

export default {
	component: {
		Oscillator: Oscillator,
		Empty: Empty,
	},
	props: ['index'],
	data: function() {
		return {};
	},
	watch: {
		index: function() {
			console.log('index changed');
		},
		nodes: function() {
			console.log('nodes changed');
		},
	},
	mounted() {
		console.log('' + this.comp); //, this.nodes[this.index].component);
	},
	computed: {
		...mapGetters(['getNode']),
		nodes: function() {
			return this.$store.state.nodes;
		},
		comp: function() {
			return this.nodes && this.nodes[this.index] ? this.nodes[this.index].component : 'Empty';
		},
		init: function() {
			return this.nodes && this.nodes[this.index] ? this.nodes[this.index].data : {};
		},
	},
};
</script>
