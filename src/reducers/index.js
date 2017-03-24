// reducers are pure functions that return an object to serve as state

const reducer = (state={name: '海涛'}, action)=>{
	switch(action.type){
		case 'CHANGE':
			return Object.assign({}, state, {
				name: action.data
			});
			break;
		case 'REMOVE':
			return Object.assign({}, state, {
				name: action.data
			})
		default:
			return state;
	}
};

export default reducer;