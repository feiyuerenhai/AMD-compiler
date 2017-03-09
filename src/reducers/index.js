const reducer = (state={list: []}, action)=>{
	switch(action.type){
		case 'ADD':
			return Object.assign({}, state, {
				message: action.data
			});
			break;
		default:
			return state;
	}
};
export default reducer;