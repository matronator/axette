"use strict";
/**
 * Copyright (c) 2021 Matronator
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hooks = void 0;
var Hooks = /** @class */ (function () {
    function Hooks() {
        this.onAjax = [];
        this.onInit = [];
        // super()
        return this;
    }
    Hooks.prototype.addOnInitHook = function (hook) {
        return this.addHook("onInit", hook);
    };
    Hooks.prototype.addOnAjaxHook = function (hook) {
        return this.addHook("onAjax", hook);
    };
    Hooks.prototype.addHook = function (event, hook) {
        if (this[event] instanceof Array) {
            // this[event].push(hook)
            return hook;
        }
        else {
            return null;
        }
    };
    return Hooks;
}());
exports.Hooks = Hooks;
