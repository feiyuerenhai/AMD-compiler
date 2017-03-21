define("src/actions/index.js", ["exports"], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	// action creators are pure functions that return actions only
	// each action will go through reducers to pump up another different state

	var change = function change(text) {
		return {
			type: 'CHANGE',
			data: text
		};
	};

	var remove = function remove() {
		return {
			type: 'REMOVE',
			data: ''
		};
	};

	exports.change = change;
	exports.remove = remove;
});

define("src/components/index.js", ["exports", "react"], function (exports, _react) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	function _possibleConstructorReturn(self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}

		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}

	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) {
			throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		}

		subClass.prototype = Object.create(superClass && superClass.prototype, {
			constructor: {
				value: subClass,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	var Greeting = function (_React$Component) {
		_inherits(Greeting, _React$Component);

		function Greeting() {
			_classCallCheck(this, Greeting);

			return _possibleConstructorReturn(this, (Greeting.__proto__ || Object.getPrototypeOf(Greeting)).apply(this, arguments));
		}

		_createClass(Greeting, [{
			key: 'render',
			value: function render() {
				var _this2 = this;

				//below are two components that do not interact but send only unidirectional actions to state
				return _react2.default.createElement(
					'div',
					null,
					_react2.default.createElement(
						'span',
						null,
						'hi ',
						this.props.name,
						', how are you ?'
					),
					_react2.default.createElement('br', null),
					_react2.default.createElement('input', { onChange: function onChange(e) {
							_this2.props.change(e.target.value);
						}, value: this.name }),
					_react2.default.createElement(
						'button',
						{ onClick: function onClick(e) {
								_this2.props.remove();
							} },
						'\u5220\u9664'
					)
				);
			}
		}, {
			key: 'name',
			get: function get() {
				return this.props.name;
			}
		}]);

		return Greeting;
	}(_react2.default.Component);

	exports.default = Greeting;
});

define("src/reducers/index.js", ["exports"], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	// reducers are pure functions that return an object to serve as state

	var reducer = function reducer() {
		var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { name: 'Jackie' };
		var action = arguments[1];

		switch (action.type) {
			case 'CHANGE':
				return Object.assign({}, state, {
					name: action.data
				});
				break;
			case 'REMOVE':
				return Object.assign({}, state, {
					name: action.data
				});
			default:
				return state;
		}
	};

	exports.default = reducer;
});

define("src/containers/index.js", ["exports", "react", "react-redux", "src/components/index.js", "src/actions/index.js"], function (exports, _react, _reactRedux, _index, _index3) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react2 = _interopRequireDefault(_react);

	var _index2 = _interopRequireDefault(_index);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	// smart components who receive wrapped state\disptach\ownProps are only to provide props to UI components

	var mapStateToProps = function mapStateToProps(state, ownProps) {
		return {
			name: state.name
		};
	};

	var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
		return {
			change: function change(value) {
				dispatch((0, _index3.change)(value));
			},
			remove: function remove() {
				dispatch((0, _index3.remove)());
			}
		};
	};

	var ConnectedGreeting = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_index2.default);

	exports.default = ConnectedGreeting;
});

define("src/index.jsx", ["react", "react-dom", "react-redux", "redux", "src/containers/index.js", "src/reducers/index.js"], function (_react, _reactDom, _reactRedux, _redux, _index, _index3) {
	'use strict';

	var _react2 = _interopRequireDefault(_react);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _index2 = _interopRequireDefault(_index);

	var _index4 = _interopRequireDefault(_index3);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	var store = (0, _redux.createStore)(_index4.default);

	_reactDom2.default.render(_react2.default.createElement(
		_reactRedux.Provider,
		{ store: store },
		_react2.default.createElement(_index2.default, null)
	), document.getElementById('app'));
});

require(["src/index.jsx"])