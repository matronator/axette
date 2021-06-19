"use strict";
/**
* Copyright (c) 2021 Matronator
*
* This software is released under the MIT License.
* https://opensource.org/licenses/MIT
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hooks = void 0;
class Hooks {
    constructor() {
        this.onAjax = [];
        this.onInit = [];
    }
    addInitHook(hook) {
        return this.addHook(`onInit`, hook);
    }
    addAjaxHook(hook) {
        return this.addHook(`onAjax`, hook);
    }
    addHook(event, hook) {
        switch (event) {
            case `onAjax`:
                this.onAjax.push(hook);
                return hook;
            case `onInit`:
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
}
exports.Hooks = Hooks;
const hooks = new Hooks;
const axette = { init, run: onAjax, hooks: hooks, on: onHook, onInit: onInitHook, onAjax: onAjaxHook, fixURL: noFlashURL };
/**
 * Registers AJAX handlers
 * @param ajaxClass CSS class to be used as selector for links and forms to be handled by AJAX
 */
function init(ajaxClass = `ajax`) {
    const links = document.querySelectorAll(`a.${ajaxClass}`);
    if (links) {
        links.forEach((link) => {
            link.addEventListener(`click`, (e) => {
                e.preventDefault();
                axette.run(e.target.href);
            });
        });
    }
    const forms = document.querySelectorAll(`form.${ajaxClass}`);
    if (forms) {
        forms.forEach(form => {
            if (form instanceof HTMLFormElement) {
                form.addEventListener(`submit`, e => {
                    e.preventDefault();
                    const formData = new FormData(form);
                    const params = (new URLSearchParams(String(formData))).toString();
                    if (form.method.toLowerCase() === `post`) {
                        axette.run(form.action, params, `application/x-www-form-urlencoded`)
                            .catch(err => console.error(err));
                    }
                    else {
                        axette.run(`${form.action}?${params}`)
                            .catch(err => console.error(err));
                    }
                });
            }
        });
    }
    axette.hooks.onInit.forEach((hook) => {
        if (hook.fn instanceof Function) {
            hook.fn(...hook.args);
        }
    });
}
/**
 * Handles Nette response by updating snippets and/or redirecting if necessary
 * @param link Target URL
 * @param data Request body
 * @param contentType `Content-Type` header
 */
function onAjax(link, data = null, contentType = `application/json`) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(link, Object.assign({ method: data ? `POST` : `GET`, headers: Object.assign({ 'X-Requested-With': 'XMLHttpRequest' }, (data && { 'Content-Type': contentType })) }, (data && { body: data })));
        const { snippets = {}, redirect = `` } = yield response.json();
        if (redirect !== ``) {
            window.location.replace(redirect);
        }
        Object.entries(snippets).forEach(([id, html]) => {
            const elem = document.getElementById(id);
            if (elem)
                elem.innerHTML = html;
        });
        axette.hooks.onAjax.forEach(hook => {
            if (hook.fn instanceof Function) {
                hook.fn(...hook.args);
            }
        });
        axette.init();
    });
}
/**
* Removes `?_fid=xxxx` from the URL that Nette adds there whenever it shows a FlashMessage.
*/
function noFlashURL() {
    let l = window.location.toString();
    let fid = l.indexOf(`_fid=`);
    if (fid !== -1) {
        let uri = l.substr(0, fid) + l.substr(fid + 10);
        if ((uri.substr(uri.length - 1) === `?`) || (uri.substr(uri.length - 1) === `&`)) {
            uri = uri.substr(0, uri.length - 1);
        }
        window.history.replaceState(``, document.title, uri);
    }
}
function onAjaxHook(callback, ...args) {
    axette.on(`onAjax`, callback, args);
}
function onInitHook(callback, ...args) {
    axette.on(`onInit`, callback, args);
}
/**
 * Add new callback to the specified event to be run every time that event is triggered
 * @param event Name of the event to add hook to (`onInit`, `onAjax`, ...)
 * @param callback Function to call
 * @param args Function arguments
 * @returns Hook or null if event name is invalid
 */
function onHook(event, callback, ...args) {
    return axette.hooks.addHook(event, { fn: callback, args: args });
}
exports.default = axette;
//# sourceMappingURL=index.js.map