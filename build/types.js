"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Hooks = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

    // super()
    return this;
  }

  _createClass(Hooks, [{
    key: "addOnInitHook",
    value: function addOnInitHook(hook) {
      return this.addHook("onInit", hook);
    }
  }, {
    key: "addOnAjaxHook",
    value: function addOnAjaxHook(hook) {
      return this.addHook("onAjax", hook);
    }
  }, {
    key: "addHook",
    value: function addHook(event, hook) {
      if (this[event] instanceof Array) {
        // this[event].push(hook)
        return hook;
      } else {
        return null;
      }
    }
  }]);

  return Hooks;
}();

exports.Hooks = Hooks;