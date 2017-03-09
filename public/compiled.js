define("src/actions/index.js", ["exports"], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var action = function action(text) {
		return {
			type: 'ADD',
			text: text
		};
	};

	exports.default = action;
});

define("src/components/index.js", ["exports", "src/actions/index.js"], function (exports, _index) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _index2 = _interopRequireDefault(_index);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var Component = 'this is a component';
  exports.default = Component;
});

define("src/containers/index.js", ["exports", "react", "src/components/index.js"], function (exports, _react, _index) {
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

	var App = _react2.default.createClass({
		displayName: 'App',

		render: function render() {
			return _react2.default.createElement(
				'div',
				null,
				'Hello World!'
			);
		}
	});

	exports.default = App;
});

define("src/index.jsx", ["react", "react-dom", "react-redux", "redux", "src/containers/index.js"], function (_react, _reactDom, _reactRedux, _redux, _index) {
  'use strict';

  var _react2 = _interopRequireDefault(_react);

  var _reactDom2 = _interopRequireDefault(_reactDom);

  var _index2 = _interopRequireDefault(_index);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  _reactDom2.default.render(_react2.default.createElement(_index2.default, null), document.getElementById('app'));
});

require(["src/index.jsx"])