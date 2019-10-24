<template>
	<div>
		<input type="text" class="todo-input" placeholder="What needs to be done" v-model="newTodo" @keyup.enter="addTodo">
		<transition-group name="fade" enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
			<todo-item v-for="(todo) in todosFiltered" :key="todo.id" :todo="todo" :checkAll="!anyRemaining">
			</todo-item>
		</transition-group>
		<div class="extra-container">
			<todo-check-all :anyRemaining="anyRemaining"></todo-check-all>
			<todo-items-remaining :remaining="remaining"></todo-items-remaining>
		</div>

		<div class="extra-container">
			<todo-filtered></todo-filtered>
			<div>
				<transition name="fade">
					<todo-clear-completed :showClearCompletedBtn="showClearCompletedBtn"></todo-clear-completed>
				</transition>
			</div>
		</div>
	</div>
</template>

<script>
import TodoItem from './TodoItem';
import TodoItemsRemaining from './TodoItemsRemaining';
import TodoCheckAll from './TodoCheckAll';
import TodoFiltered from './TodoFiltered';
import TodoClearCompleted from './TodoClearCompleted';

export default {
	name: 'todo-list',
	components: {
		TodoItem,
		TodoItemsRemaining,
		TodoCheckAll,
		TodoFiltered,
		TodoClearCompleted
	},
	data() {
		return {
			newTodo: '',
			beforeEditCache: '',
			idForTodo: 3,
			filter: 'all',
			todos: [
				{
					'id': 1,
					'title': 'Finish Vue Screencast',
					'completed': false,
					'editing': false
				},
				{
					'id': 2,
					'title': 'Take over world',
					'completed': false,
					'editing': false
				}
			]
		}
	},
	created() {
		window.eventBus.$on('finishedEdit', (data) => this.finishedEdit(data));
		window.eventBus.$on('removedTodo', (id) => this.removeTodo(id));
		window.eventBus.$on('checkAllChange', (checked) => this.checkAllTodos(checked));
		window.eventBus.$on('changeFilter', (filter) => this.filter = filter);
		window.eventBus.$on('clearCompletedTodos', () => this.clearCompleted());
	},
	beforeDestory() {
		window.eventBus.$off('finishedEdit', (data) => this.finishedEdit(data));
		window.eventBus.$off('removedTodo', (id) => this.removeTodo(id));
		window.eventBus.$off('checkAllChange', (checked) => this.checkAllTodos(checked));
		window.eventBus.$off('changeFilter', (filter) => this.filter = filter);
		window.eventBus.$off('clearCompletedTodos', () => this.clearCompleted());
	},
	computed: {
		remaining() {
			return this.todos.filter(todo => !todo.completed).length;
		},
		anyRemaining() {
			return this.remaining !== 0;
		},
		todosFiltered() {
			if(this.filter === 'all') {
				return this.todos;
			} else if(this.filter === 'active') {
				return this.todos.filter(todo => !todo.completed);
			} else if(this.filter === 'completed') {
				return this.todos.filter(todo => todo.completed);
			}
			return this.todos;
		},
		showClearCompletedBtn() {
			return this.todos.filter(todo => todo.completed).length > 0;
		}
	},
	methods: {
		addTodo() {
			if(this.newTodo.trim().length == 0){
				return;
			}
			this.todos.push({
				id: this.idForTodo,
				title: this.newTodo,
				completed: false,
				editing: false
			});
			this.newTodo = '';
			this.idForTodo++;
		},
		finishedEdit(data) {
			const index = this.todos.findIndex((item) => item.id == data.id)
			if( index > -1){
				this.todos.splice(index, 1, data);
			}
		},
		removeTodo(id) {
			const index = this.todos.findIndex((item) => item.id == id)
			this.todos.splice(index, 1);
		},
		checkAllTodos() {
			this.todos.forEach((todo) => todo.completed = event.target.checked);
		},
		clearCompleted() {
			this.todos = this.todos.filter(todo => !todo.completed);
		}
	}
}
</script>
<style lang="scss">
	@import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css");
	.todo-input {
		width: 100%;
		padding: 10px 18px;
		font-size: 18px;
		margin-bottom: 16px;

		&:focus {
			outline: 0;
		}
	}

	.todo-item {
		margin-bottom: 12px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		animation-duration: 0.3s;
	}

	.remove-item {
		cursor: pointer;
		margin-left: 14px;
		&:hover {
			color: black;
		}
	}
	.todo-item-left {
		display: flex;
		align-items: center;
	}
	.todo-item-label {
		padding: 10px;
		border: 1px solid white;
		margin-left: 12px;
	}
	.todo-item-edit {
		font-size: 24px;
		color: #2c3e50;
		margin-left: 12px;
		width: 100%;
		padding: 10px;
		border: 1px solid #ccc; //override defaults
		font-family: "Avenir", Helvetica, Arial, sans-serif;
		&:focus {
			outline: none;
		}
	}
	.completed {
		text-decoration: line-through;
		color: grey;
	}
	.extra-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 16px;
		border-top: 1px solid lightgrey;
		padding-top: 14px;
		margin-bottom: 14px;
	}
	.name-container {
		margin-bottom: 16px;
	}
	button {
		font-size: 14px;
		background-color: white;
		appearance: none;
		padding: 4px;
		&:hover {
			background: lightgreen;
		}
		&:focus {
			outline: none;
		}
	}
	.active {
		background: lightgreen;
	}
	// CSS Transitions
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.2s;
	}
	.fade-enter,
	.fade-leave-to {
		opacity: 0;
	}
</style>