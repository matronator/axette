"use strict";
/**
 * Copyright (c) 2021 Matronator
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.noFlashURL = void 0;
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
exports.noFlashURL = noFlashURL;
