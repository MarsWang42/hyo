/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
			return classNames;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {
		window.classNames = classNames;
	}
}());


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(3);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(5)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)();
// imports
exports.push([module.i, "@import url(http://fonts.googleapis.com/css?family=Montserrat:300,400,700);", ""]);

// module
exports.push([module.i, ".hyo {\n  font-family: Montserrat, sans-serif;\n  font-size: 16px;\n  -webkit-font-smoothing: antialiased;\n  text-rendering: optimizeLegibility;\n  margin: 1em 0;\n  width: 100%;\n  min-width: 300px; }\n  .hyo .filter {\n    display: flex;\n    flex-direction: row;\n    justify-content: flex-end;\n    align-items: center;\n    padding: 15px; }\n    .hyo .filter .Dropdown-root {\n      position: relative; }\n    .hyo .filter .Dropdown-control {\n      position: relative;\n      overflow: hidden;\n      background-color: white;\n      border: 1px solid #ccc;\n      border-radius: 2px;\n      box-sizing: border-box;\n      color: #333;\n      cursor: default;\n      outline: none;\n      padding: 8px 52px 8px 10px;\n      transition: all 200ms ease; }\n    .hyo .filter .Dropdown-control:hover {\n      box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06); }\n    .hyo .filter .Dropdown-arrow {\n      border-color: #999 transparent transparent;\n      border-style: solid;\n      border-width: 5px 5px 0;\n      content: ' ';\n      display: block;\n      height: 0;\n      margin-top: -ceil(2.5);\n      position: absolute;\n      right: 10px;\n      top: 14px;\n      width: 0; }\n    .hyo .filter .is-open .Dropdown-arrow {\n      border-color: transparent transparent #999;\n      border-width: 0 5px 5px; }\n    .hyo .filter .Dropdown-menu {\n      background-color: white;\n      border: 1px solid #ccc;\n      box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);\n      box-sizing: border-box;\n      margin-top: -1px;\n      max-height: 200px;\n      overflow-y: auto;\n      position: absolute;\n      top: 100%;\n      width: 100%;\n      z-index: 1000;\n      -webkit-overflow-scrolling: touch; }\n    .hyo .filter .Dropdown-option {\n      box-sizing: border-box;\n      color: rgba(51, 51, 51, 0.8);\n      cursor: pointer;\n      display: block;\n      padding: 8px 10px; }\n    .hyo .filter .Dropdown-option:last-child {\n      border-bottom-right-radius: 2px;\n      border-bottom-left-radius: 2px; }\n    .hyo .filter .Dropdown-option:hover {\n      background-color: #f2f9fc;\n      color: #333; }\n    .hyo .filter .Dropdown-option.is-selected {\n      background-color: #f2f9fc;\n      color: #333; }\n    .hyo .filter .Dropdown-noresults {\n      box-sizing: border-box;\n      color: #ccc;\n      cursor: default;\n      display: block;\n      padding: 8px 10px; }\n    .hyo .filter .Dropdown-root, .hyo .filter input {\n      margin: 5px 15px;\n      width: 20%;\n      min-width: 160px; }\n    .hyo .filter input {\n      font-family: Montserrat, sans-serif;\n      font-size: 14px;\n      padding: 10px 10px 10px 5px;\n      display: block;\n      background-color: white;\n      border: 1px solid #ccc;\n      border-radius: 2px;\n      box-sizing: border-box;\n      color: #333;\n      cursor: default;\n      outline: none;\n      padding: 8px 52px 8px 10px;\n      transition: all 200ms ease; }\n  .hyo .hyo-table {\n    display: flex;\n    flex-direction: column;\n    align-items: stretch;\n    width: 100%;\n    border-radius: .4em;\n    border: 1px solid rgba(0, 0, 0, 0.1);\n    border-collapse: collapse;\n    overflow: auto; }\n  .hyo .hyo-thead {\n    display: flex;\n    flex-direction: column;\n    align-items: stretch;\n    background: rgba(0, 0, 0, 0.03);\n    border-bottom: 1px solid rgba(0, 0, 0, 0.15);\n    box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.15); }\n    .hyo .hyo-thead .hyo-tr {\n      text-align: center;\n      display: inline-flex; }\n      .hyo .hyo-thead .hyo-tr .hyo-th {\n        border-right: 1px solid rgba(0, 0, 0, 0.05); }\n        .hyo .hyo-thead .hyo-tr .hyo-th.sortable {\n          cursor: pointer; }\n        .hyo .hyo-thead .hyo-tr .hyo-th .sort {\n          float: right;\n          margin-top: 8px; }\n        .hyo .hyo-thead .hyo-tr .hyo-th .sortup {\n          width: 0;\n          height: 0;\n          border-left: 5px solid transparent;\n          border-right: 5px solid transparent;\n          border-bottom: 5px solid black;\n          text-align: right; }\n        .hyo .hyo-thead .hyo-tr .hyo-th .sortdown {\n          width: 0;\n          height: 0;\n          border-left: 5px solid transparent;\n          border-right: 5px solid transparent;\n          border-top: 5px solid black;\n          text-align: right; }\n        .hyo .hyo-thead .hyo-tr .hyo-th:last-child {\n          border-right: 0; }\n  .hyo .hyo-tbody {\n    display: flex;\n    flex-direction: column;\n    align-items: stretch; }\n    .hyo .hyo-tbody .hyo-tr {\n      display: inline-flex; }\n      .hyo .hyo-tbody .hyo-tr .hyo-td {\n        border-right: 1px solid rgba(0, 0, 0, 0.02); }\n        .hyo .hyo-tbody .hyo-tr .hyo-td:last-child {\n          border-right: 0; }\n    .hyo .hyo-tbody .hyo-tr:nth-child(even) {\n      background-color: rgba(0, 0, 0, 0.05); }\n  .hyo .hyo-th, .hyo .hyo-td {\n    flex: 1 0 0px;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n    padding: 7px 5px;\n    overflow: hidden; }\n  .hyo .hyo-paginate {\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    justify-content: space-between;\n    border-top: 1px solid rgba(0, 0, 0, 0.15);\n    box-shadow: 0 -2px 15px 0 rgba(0, 0, 0, 0.15);\n    padding: 10px 5px; }\n    .hyo .hyo-paginate .navigator {\n      display: flex;\n      flex-direction: row;\n      align-items: center;\n      margin-right: 15px; }\n      .hyo .hyo-paginate .navigator input {\n        font-family: Montserrat, sans-serif;\n        font-size: 14px;\n        height: 20px;\n        text-indent: 4px;\n        border-radius: 5px;\n        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.55), 0px 1px 1px rgba(255, 255, 255, 0.5);\n        border: 1px solid #666;\n        width: 20px; }\n      .hyo .hyo-paginate .navigator button {\n        background: rgba(0, 0, 0, 0.03);\n        margin: 0 5px;\n        float: left;\n        line-height: 12px;\n        border: 1px solid #ddd;\n        box-shadow: 2px 2px 2px #888888;\n        border-radius: .4em; }\n", ""]);

// exports


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _classnames = __webpack_require__(0);

var _classnames2 = _interopRequireDefault(_classnames);

var _dropdown = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./dropdown\""); e.code = 'MODULE_NOT_FOUND';; throw e; }()));

var _dropdown2 = _interopRequireDefault(_dropdown);

__webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Table = function (_Component) {
  _inherits(Table, _Component);

  function Table() {
    _classCallCheck(this, Table);

    var _this = _possibleConstructorReturn(this, (Table.__proto__ || Object.getPrototypeOf(Table)).call(this));

    _this.state = {
      sortingCol: {},
      sortingDirection: "asc",
      pageRows: [],
      filterCol: "",
      filterKeyword: "",
      currentPage: 1,
      navigatorPage: 1,
      resolvedRows: []
    };
    return _this;
  }

  _createClass(Table, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.initializeStates();
    }

    /**
     * initializeStates initializes the states with given props.
     */

  }, {
    key: 'initializeStates',
    value: function initializeStates() {
      var _props = this.props,
          def = _props.def,
          data = _props.data,
          pageSize = _props.pageSize,
          pagination = _props.pagination;


      var filterCol = def.find(function (col) {
        return col.filterable;
      });
      var pages = pagination ? Math.floor(data.length / pageSize) - 1 : 0;
      var pageRows = pagination ? data.slice(0, pageSize) : data;

      this.setState({
        pageRows: pageRows,
        resolvedRows: data,
        filterCol: filterCol && filterCol.key,
        filterType: filterCol && filterCol.filterType,
        pages: pages
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _state = this.state,
          sortingCol = _state.sortingCol,
          sortingDirection = _state.sortingDirection,
          pageRows = _state.pageRows,
          filterCol = _state.filterCol,
          filterKeyword = _state.filterKeyword,
          filterType = _state.filterType,
          pages = _state.pages,
          currentPage = _state.currentPage,
          resolvedRows = _state.resolvedRows,
          navigatorPage = _state.navigatorPage;
      var _props2 = this.props,
          def = _props2.def,
          filterable = _props2.filterable,
          data = _props2.data,
          pagination = _props2.pagination,
          pageSize = _props2.pageSize;

      /**
       * updateRows is a method to all of the rows
       * being rendered as the body of table.
       */

      var updateRows = function updateRows() {
        var newSortingCol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : sortingCol;
        var newSortingDirection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : sortingDirection;
        var newFilterCol = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : filterCol;
        var newFilterKeyword = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : filterKeyword;
        var newCurrentPage = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : currentPage;
        var filtering = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
        var sorting = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;

        var newResolvedRows = resolvedRows;
        var updatedRows = void 0;

        if (sorting && newSortingCol.sortable) {
          // Figure out the current direction.
          // If column is not select, then set direction to be asc.
          // If it is already selected, set to be the opposite direction.
          newResolvedRows = data.sort(function (a, b) {
            var attr1 = a[newSortingCol.key];
            var attr2 = b[newSortingCol.key];
            var defaultOrder = !attr1 ? -1 : !attr2 ? 1 : attr1.toString().localeCompare(attr2);
            // Here you can load the columns's onSort function if it has.
            var order = newSortingCol.onSort ? newSortingCol.onSort(attr1, attr2) : defaultOrder;
            return newSortingDirection === 'asc' ? order : -order;
          });
        }

        // Take two params, Col and Keyword.
        // Filter the data according to the parms
        // and update the sorted Rows
        var newFilterType = filterType;
        if (filtering && filterable) {
          newFilterType = def.find(function (col) {
            return col.key === newFilterCol;
          }).filterType;
          // Use the side effect of sort method.
          newResolvedRows = data.filter(function (row) {
            var cell = row[newFilterCol];
            switch (newFilterType) {
              case 'input':
                return cell.toString().toLowerCase().includes(newFilterKeyword.toLowerCase());
              case 'select':
                // If it is a select filter, must match the whole keyword
                if (newFilterKeyword === "") return true;else return cell.toString() === newFilterKeyword;
              default:
                return cell.toString().toLowerCase().includes(newFilterKeyword.toLowerCase());
            }
          });
        }

        // If Pagination, slice the resolved the data within current page.
        var newPages = 0;
        if (pagination) {
          var startRow = pageSize * (newCurrentPage - 1);
          var endRow = Math.min(newResolvedRows.length, startRow + pageSize);
          newPages = Math.floor(newResolvedRows.length / pageSize) - 1;
          updatedRows = newResolvedRows.slice(startRow, endRow);
        } else updatedRows = newResolvedRows;

        _this2.setState({
          pageRows: updatedRows,
          filterCol: newFilterCol,
          filterKeyword: newFilterKeyword,
          filterType: newFilterType,
          sortingCol: newSortingCol,
          sortingDirection: newSortingDirection,
          currentPage: newCurrentPage,
          navigatorPage: newCurrentPage,
          resolvedRows: newResolvedRows,
          pages: newPages
        });
      };

      var sortColumn = function sortColumn(col) {
        if (col.sortable) {
          var dr = col.key !== sortingCol.key ? 'asc' : sortingDirection === 'asc' ? 'desc' : 'asc';
          updateRows(col, dr, filterCol, filterKeyword, currentPage, true, true);
        }
      };

      // Clear keyword while changing filterCol
      var changeFilterCol = function changeFilterCol(col) {
        updateRows(sortingCol, sortingDirection, col.key, "", currentPage, true);
      };

      var changeFilterKeyword = function changeFilterKeyword(keyword) {
        updateRows(sortingCol, sortingDirection, filterCol, keyword, currentPage, true);
      };

      var changePage = function changePage(index) {
        updateRows(sortingCol, sortingDirection, filterCol, filterKeyword, index);
      };

      var jumpPage = function jumpPage(event) {};

      /**
       * renderFilter is a function that returns the filter UI.
       */
      var renderFilter = function renderFilter() {
        var options = def.filter(function (col) {
          return col.filterable;
        });
        var generateFilterKeyword = function generateFilterKeyword() {
          switch (filterType) {
            case 'input':
              {
                return _react2.default.createElement('input', { type: 'text', id: 'filterKeyword', onChange: function onChange(e) {
                    return changeFilterKeyword(e.target.value);
                  }, placeholder: 'Keyword...' });
              }
            // For select filter, checkout all unique value in the column
            // and put them in options.
            case 'select':
              {
                var l = data.length;
                var flags = {};
                var filterOptions = [{ key: "", label: "all" }];
                for (var i = 0; i < l; i += 1) {
                  var filterOption = data[i][filterCol];
                  if (!flags[filterOption]) {
                    flags[filterOption] = true;
                    filterOptions.push(filterOption);
                  }
                }
                return _react2.default.createElement(_dropdown2.default, { options: filterOptions, onChange: function onChange(col) {
                    return changeFilterKeyword(col.key);
                  } });
              }
            default:
              return _react2.default.createElement('input', { type: 'text', id: 'filterKeyword', onChange: function onChange(e) {
                  return changeFilterKeyword(e.target.value);
                }, placeholder: 'Keyword...' });
          }
        };
        return _react2.default.createElement(
          'div',
          { className: 'filter' },
          _react2.default.createElement(
            'label',
            { htmlFor: 'filterCol' },
            'Filter:'
          ),
          _react2.default.createElement(_dropdown2.default, { options: options, onChange: function onChange(col) {
              return changeFilterCol(col);
            } }),
          _react2.default.createElement(
            'label',
            { htmlFor: 'filterKeyword' },
            'Keyword:'
          ),
          generateFilterKeyword()
        );
      };

      /*
       * Render the Pgination Controller.
       */
      var renderPagination = function renderPagination() {
        var totalRows = resolvedRows.length;
        var startRow = pageSize * (currentPage - 1) + 1;
        var endRow = Math.min(totalRows, startRow + pageSize - 1);
        return _react2.default.createElement(
          'div',
          { className: 'hyo-paginate' },
          _react2.default.createElement(
            'div',
            null,
            'Showing ',
            startRow,
            ' to ',
            endRow,
            ' of ',
            totalRows,
            ' entries'
          ),
          _react2.default.createElement(
            'div',
            { className: 'navigator' },
            _react2.default.createElement(
              'button',
              {
                type: 'button',
                disabled: currentPage === 1,
                onClick: function onClick() {
                  return changePage(1);
                }
              },
              '<<'
            ),
            _react2.default.createElement(
              'button',
              {
                type: 'button',
                disabled: currentPage === 1,
                onClick: function onClick() {
                  return changePage(currentPage - 1);
                }
              },
              '<'
            ),
            _react2.default.createElement(
              'div',
              null,
              'Go to Page',
              _react2.default.createElement('input', {
                type: 'text',
                onKeyDown: function onKeyDown(e) {
                  if (e.keyCode === 13) {
                    changePage(e.target.value);
                  }
                },
                value: navigatorPage,
                onChange: function onChange(e) {
                  var page = e.target.value;
                  console.log(pages);
                  if (page === "") _this2.setState({ navigatorPage: page });else {
                    page = Math.min(Math.max(0, e.target.value), pages + 1);
                    _this2.setState({ navigatorPage: page });
                  }
                },
                onBlur: function onBlur(e) {
                  changePage(e.target.value);
                }
              }),
              'of ',
              pages + 1
            ),
            _react2.default.createElement(
              'button',
              {
                type: 'button',
                disabled: currentPage === pages + 1,
                onClick: function onClick() {
                  return changePage(currentPage + 1);
                }
              },
              '>'
            ),
            _react2.default.createElement(
              'button',
              {
                type: 'button',
                disabled: currentPage === pages + 1,
                onClick: function onClick() {
                  return changePage(pages + 1);
                }
              },
              '>>'
            )
          )
        );
      };

      /**
       * renderHeaders returns headers according to definition
       */
      var renderHeaders = function renderHeaders() {
        var headers = def.map(function (col) {
          var thClassName = (0, _classnames2.default)({
            "hyo-th": true,
            "sortable": col.sortable
          });
          var spanClassName = (0, _classnames2.default)({
            "sort": col.sortable,
            "sortup": col.sortable && col.key === sortingCol.key && sortingDirection === "asc",
            "sortdown": col.sortable && col.key === sortingCol.key && sortingDirection === "desc"
          });
          return _react2.default.createElement(
            'div',
            { key: col.key, className: thClassName, onClick: function onClick() {
                return sortColumn(col);
              } },
            col.label,
            _react2.default.createElement('span', { className: spanClassName })
          );
        });
        return _react2.default.createElement(
          'div',
          { className: 'hyo-thead' },
          _react2.default.createElement(
            'div',
            { className: 'hyo-tr' },
            headers
          )
        );
      };

      /**
       * renderRows returns each row according to data.
       */
      var renderRows = function renderRows() {
        var i = 0;
        var rows = pageRows.map(function (row) {
          i += 1;
          var cell = def.map(function (col) {
            return _react2.default.createElement(
              'div',
              { className: 'hyo-td', key: 'hyo-cell-' + col.key + '-' + i },
              col.renderer ? col.renderer(row[col.key]) : row[col.key]
            );
          });
          return _react2.default.createElement(
            'div',
            { className: 'hyo-tr', key: 'hyo-row-' + i },
            cell
          );
        });
        return _react2.default.createElement(
          'div',
          { className: 'hyo-tbody' },
          rows
        );
      };

      /**
       * renderTable generates the whole table.
       */
      var renderTable = function renderTable() {
        return _react2.default.createElement(
          'div',
          { className: 'hyo' },
          filterable && renderFilter(),
          _react2.default.createElement(
            'div',
            { className: 'hyo-table' },
            renderHeaders(),
            renderRows(),
            pagination && renderPagination()
          )
        );
      };

      return renderTable();
    }
  }]);

  return Table;
}(_react.Component);

exports.default = Table;


Table.propTypes = {
  def: _react.PropTypes.arrayOf(_react.PropTypes.shape({
    key: _react.PropTypes.string.isRequired,
    label: _react.PropTypes.string.isRequired,
    sortable: _react.PropTypes.bool,
    onSort: _react.PropTypes.function,
    renderer: _react.PropTypes.function
  })).isRequired,
  data: _react.PropTypes.arrayOf(_react.PropTypes.object).isRequired,
  filterable: _react.PropTypes.bool,
  pagination: _react.PropTypes.bool,
  pageSize: _react.PropTypes.number
};

Table.defaultProps = {
  filterable: false,
  pagination: false,
  pageSize: 0
};

/***/ })
/******/ ]);
//# sourceMappingURL=hyo.js.map