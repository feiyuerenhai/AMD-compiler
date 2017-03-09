import React from 'react';
import ReactDOM from 'react-dom';
import {connect, Provider} from 'react-redux';
import {createStore} from 'redux';

import App from './containers/index.js';

ReactDOM.render(<App/>, document.getElementById('app'));