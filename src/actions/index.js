// action creators are pure functions that return actions only
// each action will go through reducers to pump up another different state

var deep = require('deep/index.js');

const change = (text)=>{
	return {
		type: 'CHANGE',
		data: text
	}
};

const remove = ()=>{
	return {
		type: 'REMOVE',
		data: ''
	}
};

export {change, remove, deep}