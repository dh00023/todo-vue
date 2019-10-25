import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
	state: {
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
	},
	// 컴포넌트의 computed 속성과 비슷하다. 
	// computed 처럼 종속성에 따라 결과를 캐싱하고, 종속성이 변경된 경우에만 다시 계산한다.
	getters: {
		remaining(state) {
			return state.todos.filter(todo => !todo.completed).length;
		},
		// 여기서 두번째 인자 getters를 전달 받아, 다른 getters를 사용할 수 있다.
		anyRemaining(state, getters) {
			return getters.remaining !== 0;
		},
		todosFiltered(state) {
			if(state.filter === 'all') {
				return state.todos;
			} else if(state.filter === 'active') {
				return state.todos.filter(todo => !todo.completed);
			} else if(state.filter === 'completed') {
				return state.todos.filter(todo => todo.completed);
			}
			return state.todos;
		},
		showClearCompletedBtn(state) {
			return state.todos.filter(todo => todo.completed).length > 0;
		}
	},
	// mutation은 state 값을 변경하는 로직
	// 인자를 받아 vuex에 넘겨줄 수 있고, methods와 연결
	mutations: {
		addTodo(state, payload) {
			state.todos.push({
				id: payload.id,
				title: payload.title,
				completed: payload.completed,
				editing: payload.editing
			});
		},
		clearCompleted(state) {
			state.todos = state.todos.filter(todo => !todo.completed);
		},
		changeFilter(state, payload) {
			state.filter = payload;
		},
		checkAllTodos(state, payload) {
			state.todos.forEach((todo) => todo.completed = payload);
		},
		removeTodo(state, payload) {
			// vuex state에서 데이터를 관리하기 때문에 직접 바로 접근가능
			const index = state.todos.findIndex((item) => item.id == payload);
			state.todos.splice(index, 1);
		},
		completedEdit(state, payload){
			const index = state.todos.findIndex((item) => item.id == payload.id);
			if( index > -1){
				state.todos.splice(index, 1, payload);
			}
		}
	},
	// 비동기로 데이터 연동을 하는 경우에 주로 actions를 사용
	actions: {
		addTodo(context, payload) {
			setTimeout(() => {
				context.commit('addTodo', payload);
			}, 1000);
		},
		clearCompleted(context) {
			setTimeout(() => {
				context.commit('clearCompleted');
			}, 1000);
		},
		changeFilter(context, payload) {
			setTimeout(() => {
				context.commit('changeFilter', payload);
			}, 1000);
		},
		checkAllTodos(context, payload) {
			context.commit('checkAllTodos', payload);
		},
		removeTodo(context, payload) {
			context.commit('removeTodo', payload);
		},
		completedEdit(context, payload){
			context.commit('completedEdit', payload);
		}
	}
});