<template>
	<div class="todo-item">
		<div class="todo-item-left">
			<input type="checkbox" v-model="completed" @change="doneEdit">
			<div v-if="!editing" @dblclick="editTodo" class="todo-item-label" :class="{ completed : completed }">{{ title }}</div>
				<input v-else @blur="doneEdit" @keyup.enter="doneEdit" @keyup.escape="cancleEdit" class="todo-item-edit" type="text" v-model="title" v-focus>
		</div>
		<div>
			<button @click="pluralize(todo.id)">Plural</button>
			<span class="remove-item" @click="removeTodo(todo.id)">
				&times;
			</span>	
		</div>
	</div>
</template>

<script>
export default {
	name: 'todo-item',
	props: {
		todo: {
			type: Object,
			required: true
		},
		checkAll: {
			type: Boolean,
			required: true
		}
	},
	data() {
		return {
			'id': this.todo.id,
			'title': this.todo.title,
			'completed': this.todo.completed,
			'editing': this.todo.editing,
			'beforeEditCache': this.todo.beforeEditCache
		}
	},
	created() {
		window.eventBus.$on('pluralize', this.handlePluralize);
	},
	beforeDestory() {
		window.eventBus.$off('pluralize', this.handlePluralize);
	},
	// watch 속성은 데이터 변화를 감지해 자동으로 특정 로직을 수행한다
	watch: {
		checkAll() {
			this.completed = this.checkAll ? true : this.todo.completed;
		}
	},
	directives: {
		focus: {
			// 디렉티브 정의
			inserted: function (el) {
				el.focus()
			}
		}
	},
	methods: {
		removeTodo(id) {
			this.$store.dispatch('removeTodo', id);
		},
		editTodo() {
			this.beforeEditCache = this.title;
			this.editing = true;
		},
		doneEdit() {
			if(this.title.trim() == ''){
				this.title = this.beforeEditCache;
			}
			this.editing = false;
			this.$store.dispatch('completedEdit', {
					'id': this.id,
					'title': this.title,
					'completed': this.completed,
					'editing': this.editing
			});
		},
		cancleEdit() {
			this.title = this.beforeEditCache;
			this.editing = false;
		},
		pluralize() {
			window.eventBus.$emit('pluralize');
		},
		handlePluralize(){
			this.title = this.title + 's';
			this.$store.dispatch('completedEdit', {
					'id': this.id,
					'title': this.title,
					'completed': this.completed,
					'editing': this.editing
			});
		},
	}
}
</script>