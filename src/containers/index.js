// smart components who receive wrapped state\disptach\ownProps are only to provide props to UI components

//connected components have access to state

import React from 'react';
import {connect} from 'react-redux';
import Greeting from '../components/index.js';
import {change, remove} from '../actions/index.js';

const mapStateToProps = function(state, ownProps){
	return {
		name: state.name
	}
};

const mapDispatchToProps = function(dispatch, ownProps){
	return{
		change(value){
			dispatch( change( value ) );
		},
		remove(){
			dispatch( remove() );
		}
	}
};

const ConnectedGreeting = connect(mapStateToProps, mapDispatchToProps)(Greeting);

export default ConnectedGreeting;