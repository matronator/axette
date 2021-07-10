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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hooks = void 0;
var Hooks = /** @class */ (function () {
    function Hooks() {
        this.onAjax = [];
        this.onInit = [];
    }
    Hooks.prototype.addInitHook = function (hook) {
        return this.addHook("onInit", hook);
    };
    Hooks.prototype.addAjaxHook = function (hook) {
        return this.addHook("onAjax", hook);
    };
    Hooks.prototype.addHook = function (event, hook) {
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
    };
    return Hooks;
}());
exports.Hooks = Hooks;
var hooks = new Hooks;
var axette = { init: init, run: onAjax, hooks: hooks, on: onHook, onInit: onInitHook, onAjax: onAjaxHook, fixURL: noFlashURL };
// function initNetteAjax(documentOrElement = document) {
//     ;[...documentOrElement.querySelectorAll(".ajax, [data-ajax]")].forEach(
//         (element) => {
//             if (element instanceof HTMLFormElement) {
//                 element.onsubmit = async (e) => {
//                     e.preventDefault()
//                     const formEntriesModified = await Promise.all([...new FormData(element).entries()].map(formEntryWithoutBase64))
//                     const body = new FormData()
//                     for (const [key, value] of formEntriesModified) {
//                         body.append(key, value)
//                     }
//                     await window.requestSnippets({
//                         endpoint: element.action,
//                         method: "POST",
//                         body,
//                         element,
//                     })
//                     element.reset()
//                 }
//             }
//                 if (element instanceof HTMLAnchorElement) {
//                     element.onclick = async (e) => {
//                         e.preventDefault()
//                         await window.requestSnippets({
//                             endpoint: element.href,
//                             method: "GET",
//                             element,
//                         })
//                     }
//                 }
//                 if (
//                     element instanceof HTMLButtonElement ||
//                     (element instanceof HTMLInputElement && element.type === "button")
//                     ) {
//                         element.onclick = async (e) => {
//                             e.preventDefault()
//                             await window.requestSnippets({
//                                 endpoint: element.dataset.ajax,
//                                 method: "GET",
//                                 element,
//                             })
//                         }
//                     }
//                 }
//                 )
//             }
/**
* Registers AJAX handlers
* @param ajaxClass CSS class to be used as selector for links and forms to be handled by AJAX
*/
function init(ajaxClass) {
    var _this = this;
    if (ajaxClass === void 0) { ajaxClass = "ajax"; }
    var links = document.querySelectorAll("a." + ajaxClass);
    if (links) {
        links.forEach(function (link) {
            link.addEventListener("click", function (e) {
                e.preventDefault();
                axette.run(e.target.href);
            });
        });
    }
    var forms = document.querySelectorAll("form." + ajaxClass);
    if (forms) {
        forms.forEach(function (form) {
            if (form instanceof HTMLFormElement) {
                form.addEventListener("submit", function (e) { return __awaiter(_this, void 0, void 0, function () {
                    var body, formData, params;
                    return __generator(this, function (_a) {
                        e.preventDefault();
                        body = new FormData(form);
                        if (form.method.toLowerCase() === "post") {
                            axette.run(form.action, body, "application/form-multipart", form, "POST")
                                .catch(function (err) { return console.error(err); });
                        }
                        else {
                            formData = new FormData(form);
                            params = (new URLSearchParams(String(formData))).toString();
                            axette.run(form.action + "?" + params)
                                .catch(function (err) { return console.error(err); });
                        }
                        form.reset();
                        return [2 /*return*/];
                    });
                }); });
            }
        });
    }
    axette.hooks.onInit.forEach(function (hook) {
        if (hook.fn instanceof Function) {
            hook.fn.apply(hook, hook.args);
        }
    });
}
/**
* Handles Nette response by updating snippets and/or redirecting if necessary
* @param link (string) Target URL
* @param requestBody (any) Request body
* @param contentType (string) `Content-Type` header (default: `application/json`)
* @param element (Element) The element that sent the event
* @param method (string) HTTP method (default: `POST`)
*/
function onAjax(link, requestBody, contentType, element, method) {
    if (requestBody === void 0) { requestBody = null; }
    if (contentType === void 0) { contentType = "application/json"; }
    if (element === void 0) { element = null; }
    if (method === void 0) { method = "POST"; }
    return __awaiter(this, void 0, void 0, function () {
        var formParent, response, _a, _b, snippets, _c, redirect;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    formParent = element ? element.closest("form[data-ajax-parent]") : null;
                    return [4 /*yield*/, fetch(link, {
                            method: formParent ? "POST" : method,
                            headers: { "X-Requested-With": "XMLHttpRequest" },
                            body: requestBody,
                        })];
                case 1:
                    response = _d.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    _a = _d.sent(), _b = _a.snippets, snippets = _b === void 0 ? {} : _b, _c = _a.redirect, redirect = _c === void 0 ? "" : _c;
                    if (redirect !== "") {
                        window.location.replace(redirect);
                    }
                    Object.entries(snippets).forEach(function (_a) {
                        var id = _a[0], html = _a[1];
                        var elem = document.getElementById(id);
                        if (elem)
                            elem.innerHTML = html;
                    });
                    axette.hooks.onAjax.forEach(function (hook) {
                        if (hook.fn instanceof Function) {
                            hook.fn.apply(hook, hook.args);
                        }
                    });
                    axette.init();
                    return [2 /*return*/];
            }
        });
    });
}
/**
* Removes `?_fid=xxxx` from the URL that Nette adds there whenever it shows a FlashMessage.
*/
function noFlashURL() {
    var l = window.location.toString();
    var fid = l.indexOf("_fid=");
    if (fid !== -1) {
        var uri = l.substr(0, fid) + l.substr(fid + 10);
        if ((uri.substr(uri.length - 1) === "?") || (uri.substr(uri.length - 1) === "&")) {
            uri = uri.substr(0, uri.length - 1);
        }
        window.history.replaceState("", document.title, uri);
    }
}
function onAjaxHook(callback) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    axette.on("onAjax", callback, args);
}
function onInitHook(callback) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
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
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return axette.hooks.addHook(event, { fn: callback, args: args });
}
exports.default = axette;
