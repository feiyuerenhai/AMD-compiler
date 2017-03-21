import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import ConnectedGreeting from './containers/index.js';
import reducer from './reducers/index.js';

let store = createStore(reducer);

ReactDOM.render(
	<Provider store={store}>
		<ConnectedGreeting/>
  	</Provider>, document.getElementById('app'));
