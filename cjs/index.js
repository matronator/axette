'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/**
* Copyright (c) 2021 Matronator
*
* This software is released under the MIT License.
* https://opensource.org/licenses/MIT
*/
var Hooks = /*#__PURE__*/function () {
  function Hooks() {
    _classCallCheck(this, Hooks);

    _defineProperty(this, "onAjax", []);

    _defineProperty(this, "onInit", []);
  }

  _createClass(Hooks, [{
    key: "addInitHook",
    value: function addInitHook(hook) {
      return this.addHook("onInit", hook);
    }
  }, {
    key: "addAjaxHook",
    value: function addAjaxHook(hook) {
      return this.addHook("onAjax", hook);
    }
  }, {
    key: "addHook",
    value: function addHook(event, hook) {
      switch (event) {
        case "onAjax":
          this.onAjax.push(hook);
          return hook;

        case "onInit":
          this.onInit.push(hook);
          return hook;

        default:
          if (this[event] instanceof Array) {
            Array.prototype.push.call(this[event], hook);
            return hook;
          }

          return null;
      }
    }
  }]);

  return Hooks;
}();
var hooks = new Hooks();
var axette = {
  init: init,
  run: onAjax,
  hooks: hooks,
  on: onHook,
  onInit: onInitHook,
  onAjax: onAjaxHook,
  fixURL: noFlashURL
};
/**
 * Registers AJAX handlers
 * @param ajaxClass CSS class to be used as selector for links and forms to be handled by AJAX
 */

function init() {
  var ajaxClass = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "ajax";
  var links = document.querySelectorAll("a.".concat(ajaxClass));

  if (links) {
    links.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        axette.run(e.target.href);
      });
    });
  }

  var forms = document.querySelectorAll("form.".concat(ajaxClass));

  if (forms) {
    forms.forEach(function (form) {
      if (form instanceof HTMLFormElement) {
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          var formData = new FormData(form);
          var params = new URLSearchParams(String(formData)).toString();

          if (form.method.toLowerCase() === "post") {
            axette.run(form.action, params, "application/x-www-form-urlencoded")["catch"](function (err) {
              return console.error(err);
            });
          } else {
            axette.run("".concat(form.action, "?").concat(params))["catch"](function (err) {
              return console.error(err);
            });
          }
        });
      }
    });
  }

  axette.hooks.onInit.forEach(function (hook) {
    if (hook.fn instanceof Function) {
      hook.fn.apply(hook, _toConsumableArray(hook.args));
    }
  });
}
/**
 * Handles Nette response by updating snippets and/or redirecting if necessary
 * @param link Target URL
 * @param data Request body
 * @param contentType `Content-Type` header
 */


function onAjax(_x) {
  return _onAjax.apply(this, arguments);
}
/**
* Removes `?_fid=xxxx` from the URL that Nette adds there whenever it shows a FlashMessage.
*/


function _onAjax() {
  _onAjax = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(link) {
    var data,
        contentType,
        response,
        _yield$response$json,
        _yield$response$json$,
        snippets,
        _yield$response$json$2,
        redirect,
        _args = arguments;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            data = _args.length > 1 && _args[1] !== undefined ? _args[1] : null;
            contentType = _args.length > 2 && _args[2] !== undefined ? _args[2] : "application/json";
            _context.next = 4;
            return fetch(link, _objectSpread2({
              method: data ? "POST" : "GET",
              headers: _objectSpread2({
                'X-Requested-With': 'XMLHttpRequest'
              }, data && {
                'Content-Type': contentType
              })
            }, data && {
              body: data
            }));

          case 4:
            response = _context.sent;
            _context.next = 7;
            return response.json();

          case 7:
            _yield$response$json = _context.sent;
            _yield$response$json$ = _yield$response$json.snippets;
            snippets = _yield$response$json$ === void 0 ? {} : _yield$response$json$;
            _yield$response$json$2 = _yield$response$json.redirect;
            redirect = _yield$response$json$2 === void 0 ? "" : _yield$response$json$2;

            if (redirect !== "") {
              window.location.replace(redirect);
            }

            Object.entries(snippets).forEach(function (_ref) {
              var _ref2 = _slicedToArray(_ref, 2),
                  id = _ref2[0],
                  html = _ref2[1];

              var elem = document.getElementById(id);
              if (elem) elem.innerHTML = html;
            });
            axette.hooks.onAjax.forEach(function (hook) {
              if (hook.fn instanceof Function) {
                hook.fn.apply(hook, _toConsumableArray(hook.args));
              }
            });
            axette.init();

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _onAjax.apply(this, arguments);
}

function noFlashURL() {
  var l = window.location.toString();
  var fid = l.indexOf("_fid=");

  if (fid !== -1) {
    var uri = l.substr(0, fid) + l.substr(fid + 10);

    if (uri.substr(uri.length - 1) === "?" || uri.substr(uri.length - 1) === "&") {
      uri = uri.substr(0, uri.length - 1);
    }

    window.history.replaceState("", document.title, uri);
  }
}

function onAjaxHook(callback) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  axette.on("onAjax", callback, args);
}

function onInitHook(callback) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  axette.on("onInit", callback, args);
}
/**
 * Add new callback to the specified event to be run every time that event is triggered
 * @param event Name of the event to add hook to (`onInit`, `onAjax`, ...)
 * @param callback Function to call
 * @param args Function arguments
 * @returns Hook or null if event name is invalid
 */


function onHook(event, callback) {
  for (var _len3 = arguments.length, args = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
    args[_key3 - 2] = arguments[_key3];
  }

  return axette.hooks.addHook(event, {
    fn: callback,
    args: args
  });
}

exports.Hooks = Hooks;
exports.default = axette;
