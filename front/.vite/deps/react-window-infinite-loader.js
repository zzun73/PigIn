import {
  __toESM,
  require_react
} from "./chunk-JRE55LYH.js";

// node_modules/react-window-infinite-loader/dist/index.esm.js
var import_react = __toESM(require_react());
function isInteger(value) {
  return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
}
function isRangeVisible(_ref) {
  var lastRenderedStartIndex = _ref.lastRenderedStartIndex, lastRenderedStopIndex = _ref.lastRenderedStopIndex, startIndex = _ref.startIndex, stopIndex = _ref.stopIndex;
  return !(startIndex > lastRenderedStopIndex || stopIndex < lastRenderedStartIndex);
}
function scanForUnloadedRanges(_ref) {
  var isItemLoaded = _ref.isItemLoaded, itemCount = _ref.itemCount, minimumBatchSize = _ref.minimumBatchSize, startIndex = _ref.startIndex, stopIndex = _ref.stopIndex;
  var unloadedRanges = [];
  var rangeStartIndex = null;
  var rangeStopIndex = null;
  for (var _index = startIndex; _index <= stopIndex; _index++) {
    var loaded = isItemLoaded(_index);
    if (!loaded) {
      rangeStopIndex = _index;
      if (rangeStartIndex === null) {
        rangeStartIndex = _index;
      }
    } else if (rangeStopIndex !== null) {
      unloadedRanges.push(rangeStartIndex, rangeStopIndex);
      rangeStartIndex = rangeStopIndex = null;
    }
  }
  if (rangeStopIndex !== null) {
    var potentialStopIndex = Math.min(Math.max(rangeStopIndex, rangeStartIndex + minimumBatchSize - 1), itemCount - 1);
    for (var _index2 = rangeStopIndex + 1; _index2 <= potentialStopIndex; _index2++) {
      if (!isItemLoaded(_index2)) {
        rangeStopIndex = _index2;
      } else {
        break;
      }
    }
    unloadedRanges.push(rangeStartIndex, rangeStopIndex);
  }
  if (unloadedRanges.length) {
    while (unloadedRanges[1] - unloadedRanges[0] + 1 < minimumBatchSize && unloadedRanges[0] > 0) {
      var _index3 = unloadedRanges[0] - 1;
      if (!isItemLoaded(_index3)) {
        unloadedRanges[0] = _index3;
      } else {
        break;
      }
    }
  }
  return unloadedRanges;
}
var classCallCheck = function(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
var createClass = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var inherits = function(subClass, superClass) {
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
};
var possibleConstructorReturn = function(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};
var InfiniteLoader = function(_PureComponent) {
  inherits(InfiniteLoader2, _PureComponent);
  function InfiniteLoader2() {
    var _ref;
    var _temp, _this, _ret;
    classCallCheck(this, InfiniteLoader2);
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = InfiniteLoader2.__proto__ || Object.getPrototypeOf(InfiniteLoader2)).call.apply(_ref, [this].concat(args))), _this), _this._lastRenderedStartIndex = -1, _this._lastRenderedStopIndex = -1, _this._memoizedUnloadedRanges = [], _this._onItemsRendered = function(_ref2) {
      var visibleStartIndex = _ref2.visibleStartIndex, visibleStopIndex = _ref2.visibleStopIndex;
      if (true) {
        if (!isInteger(visibleStartIndex) || !isInteger(visibleStopIndex)) {
          console.warn("Invalid onItemsRendered signature; please refer to InfiniteLoader documentation.");
        }
        if (typeof _this.props.loadMoreRows === "function") {
          console.warn('InfiniteLoader "loadMoreRows" prop has been renamed to "loadMoreItems".');
        }
      }
      _this._lastRenderedStartIndex = visibleStartIndex;
      _this._lastRenderedStopIndex = visibleStopIndex;
      _this._ensureRowsLoaded(visibleStartIndex, visibleStopIndex);
    }, _this._setRef = function(listRef) {
      _this._listRef = listRef;
    }, _temp), possibleConstructorReturn(_this, _ret);
  }
  createClass(InfiniteLoader2, [{
    key: "resetloadMoreItemsCache",
    value: function resetloadMoreItemsCache() {
      var autoReload = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
      this._memoizedUnloadedRanges = [];
      if (autoReload) {
        this._ensureRowsLoaded(this._lastRenderedStartIndex, this._lastRenderedStopIndex);
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      if (true) {
        if (this._listRef == null) {
          console.warn("Invalid list ref; please refer to InfiniteLoader documentation.");
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var children = this.props.children;
      return children({
        onItemsRendered: this._onItemsRendered,
        ref: this._setRef
      });
    }
  }, {
    key: "_ensureRowsLoaded",
    value: function _ensureRowsLoaded(startIndex, stopIndex) {
      var _props = this.props, isItemLoaded = _props.isItemLoaded, itemCount = _props.itemCount, _props$minimumBatchSi = _props.minimumBatchSize, minimumBatchSize = _props$minimumBatchSi === void 0 ? 10 : _props$minimumBatchSi, _props$threshold = _props.threshold, threshold = _props$threshold === void 0 ? 15 : _props$threshold;
      var unloadedRanges = scanForUnloadedRanges({
        isItemLoaded,
        itemCount,
        minimumBatchSize,
        startIndex: Math.max(0, startIndex - threshold),
        stopIndex: Math.min(itemCount - 1, stopIndex + threshold)
      });
      if (this._memoizedUnloadedRanges.length !== unloadedRanges.length || this._memoizedUnloadedRanges.some(function(startOrStop, index) {
        return unloadedRanges[index] !== startOrStop;
      })) {
        this._memoizedUnloadedRanges = unloadedRanges;
        this._loadUnloadedRanges(unloadedRanges);
      }
    }
  }, {
    key: "_loadUnloadedRanges",
    value: function _loadUnloadedRanges(unloadedRanges) {
      var _this2 = this;
      var loadMoreItems = this.props.loadMoreItems || this.props.loadMoreRows;
      var _loop = function _loop2(i2) {
        var startIndex = unloadedRanges[i2];
        var stopIndex = unloadedRanges[i2 + 1];
        var promise = loadMoreItems(startIndex, stopIndex);
        if (promise != null) {
          promise.then(function() {
            if (isRangeVisible({
              lastRenderedStartIndex: _this2._lastRenderedStartIndex,
              lastRenderedStopIndex: _this2._lastRenderedStopIndex,
              startIndex,
              stopIndex
            })) {
              if (_this2._listRef == null) {
                return;
              }
              if (typeof _this2._listRef.resetAfterIndex === "function") {
                _this2._listRef.resetAfterIndex(startIndex, true);
              } else {
                if (typeof _this2._listRef._getItemStyleCache === "function") {
                  _this2._listRef._getItemStyleCache(-1);
                }
                _this2._listRef.forceUpdate();
              }
            }
          });
        }
      };
      for (var i = 0; i < unloadedRanges.length; i += 2) {
        _loop(i);
      }
    }
  }]);
  return InfiniteLoader2;
}(import_react.PureComponent);
var index_esm_default = InfiniteLoader;
export {
  index_esm_default as default
};
//# sourceMappingURL=react-window-infinite-loader.js.map
