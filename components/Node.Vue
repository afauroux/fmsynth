<template>
    <component :is="comp" :index="index"/>
</template>

<script>
import Empty from '~/components/Empty.vue';

export default {
	component: {
		Empty,
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
		//console.log('' + this.$component['Empty']); //, this.nodes[this.index].component);
	},
	computed: {
		nodes: function() {
			return this.$store.state.nodes;
		},
		comp: function() {
			return this.nodes && this.nodes[this.index] ? this.nodes[this.index].component : Empty;
		},
		init: function() {
			return this.nodes && this.nodes[this.index] ? this.nodes[this.index].data : {};
		},
	},
};
</script>
