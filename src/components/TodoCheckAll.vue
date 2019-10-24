<template>
	<div>
		<label><input type="checkbox" :checked="!anyRemaining" @change="allChecking">Check All</label>
	</div>
</template>
<script>
export default {
	name: 'todo-check-all',
	props: {
		anyRemaining: {
			type: Boolean,
			required: true
		}
	},
	methods: {
		allChecking() {
			window.eventBus.$emit('checkAllChange', this.anyRemaining);
		},
	}
}	
</script>
