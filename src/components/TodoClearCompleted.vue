<template>
	<button v-if="showClearCompletedBtn" @click="clearCompleted">Clear Completed</button>
</template>
<script>
export default {
	name: 'todo-clear-completed',
	props: {
		showClearCompletedBtn: {
			type: Boolean,
			required: true
		}
	},
	methods: {
		clearCompleted() {
			window.eventBus.$emit('clearCompletedTodos');
		}
	}
}	
</script>
