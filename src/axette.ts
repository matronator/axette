/**
* Copyright (c) 2021 Matronator
*
* This software is released under the MIT License.
* https://opensource.org/licenses/MIT
*/

export type Hook = {
    callback: Function,
    args: any[],
}

class Hooks {
    onAjax: Hook[] = [];
    onInit: Hook[] = [];

    addInitHook(hook: Hook): Hook|null {
        return this.addHook(`onInit`, hook);
    }

    addAjaxHook(hook: Hook): Hook|null {
        return this.addHook(`onAjax`, hook);
    }

    addHook(event: keyof Hooks, hook: Hook): Hook|null {
        switch(event) {
            case `onAjax`:
                return this.addAjaxHook(hook);
            case `onInit`:
                return this.addInitHook(hook);
            default:
                if (this[event] instanceof Array) {
                    Array.prototype.push.call(this[event], hook);
                    return hook;
                }
                return null;
        }
    }
}

export const hooks = new Hooks;

const axette = { init, run: handleAjax, hooks: hooks, on: onHook, onInit: onInitHook, onAjax: onAjaxHook, fixURL: noFlashURL };

// function initNetteAjax(documentOrElement = document) {
//     ;[...documentOrElement.querySelectorAll(".ajax, [data-ajax]")].forEach(;
//         (element) => {
//             if (element instanceof HTMLFormElement) {
//                 element.onsubmit = async (e) => {
//                     e.preventDefault();
//                     const formEntriesModified = await Promise.all([...new FormData(element).entries()].map(formEntryWithoutBase64));
//                     const body = new FormData();
//                     for (const [key, value] of formEntriesModified) {
//                         body.append(key, value);
//                     }
//                     await window.requestSnippets({
//                         endpoint: element.action,
//                         method: "POST",
//                         body,
//                         element,
//                     });
//                     element.reset();
//                 }
//             }
//                 if (element instanceof HTMLAnchorElement) {
//                     element.onclick = async (e) => {
//                         e.preventDefault();
//                         await window.requestSnippets({
//                             endpoint: element.href,
//                             method: "GET",
//                             element,
//                         });
//                     }
//                 }
//                 if (;
//                     element instanceof HTMLButtonElement ||
//                     (element instanceof HTMLInputElement && element.type === "button");
//                     ) {
//                         element.onclick = async (e) => {
//                             e.preventDefault();
//                             await window.requestSnippets({
//                                 endpoint: element.dataset.ajax,
//                                 method: "GET",
//                                 element,
//                             });
//                         }
//                     }
//                 }
//                 );
//             }

/**
* Registers AJAX handlers
* @param selector CSS class to be used as selector for links and forms to be handled by AJAX
*/
function init(selector: string = `.ajax`) {
    const links = document.querySelectorAll(`a${selector}`);
    if (links) {
        links.forEach((link: Element) => {
            link.addEventListener(`click`, (e: Event) => {
                e.preventDefault();
                axette.run((e.currentTarget as HTMLAnchorElement).href);
            });
        });
    }

    const forms = document.querySelectorAll(`form${selector}`);
    if (forms) {
        forms.forEach(form => {
            if (form instanceof HTMLFormElement) {
                form.addEventListener(`submit`, async (e) => {
                    e.preventDefault();
                    const body = new FormData(form);
                    if (form.method.toLowerCase() === `post`) {
                        axette.run(form.action, 'POST', body, {'Content-Type': `application/form-multipart`}, form as Element).catch(err => console.error(err));
                    } else {
                        const formData = new FormData(form);
                        const params = (new URLSearchParams(String(formData))).toString();
                        axette.run(`${form.action}?${params}`).catch(err => console.error(err));
                    }

                    form.reset();
                });
            }
        });
    }

    hooks.onInit.forEach((hook: Hook) => {
        if (hook.callback instanceof Function) {
            hook.callback(...hook.args);
        }
    });
}

/**
* Handles Nette response by updating snippets and/or redirecting if necessary
* @param url (string) Target URL
* @param method (string) HTTP method (default: `POST`)
* @param requestBody (any) Request body
* @param headers (string) `Content-Type` header (default: `application/json`)
* @param element (Element) The element that sent the event
*/
async function handleAjax(url: string, method: string = `POST`, requestBody?: BodyInit|null, headers: {[key: string]: string} = {'Content-Type': `application/json`}, element: Element|null = null) {
    const formParent = element ? element.closest("form[data-ajax-parent]") : null;
    const response = await fetch(url, {
        method: formParent ? "POST" : method,
        headers: Object.assign(headers, {"X-Requested-With": "XMLHttpRequest"}),
        body: requestBody,
    });

    const { snippets = {}, redirect = `` } = await response.json();
    if (redirect !== ``) {
        window.location.replace(redirect);
    }
    Object.entries(snippets).forEach(([id, html]) => {
        setHtml(id, html as string);
    });

    hooks.onAjax.forEach(hook => {
        if (hook.callback instanceof Function) {
            hook.callback(...hook.args);
        }
    });

    init();
}

function setHtml(id: string, html: string) {
    const elem = document.getElementById(id);
    if (!elem) return;

    elem.innerHTML = html;
    elem.querySelectorAll(`script`).forEach(script => {
        const newScript = document.createElement(`script`);
        Array.from(script.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        const scriptContent = document.createTextNode(script.innerHTML);
        newScript.appendChild(scriptContent);
        script.parentNode?.replaceChild(newScript, script);
    });
}

/**
* Removes `?_fid=xxxx` from the URL that Nette adds there whenever it shows a FlashMessage.
*/
function noFlashURL() {
    let l = window.location.toString();
    let fid = l.indexOf(`_fid=`);
    if(fid !== -1) {
        let uri: string = l.substring(0, fid) + l.substring(fid + 10);
        if ((uri.substring(uri.length - 1) === `?`) || (uri.substring(uri.length - 1) === `&`)) {
            uri = uri.substring(0, uri.length - 1);
        }
        window.history.replaceState(``, document.title, uri);
    }
}

function onAjaxHook(callback: Function, ...args: any[]) {
    axette.on(`onAjax`, callback, args);
}

function onInitHook(callback: Function, ...args: any[]) {
    axette.on(`onInit`, callback, args);
}

/**
* Add new callback to the specified event to be run every time that event is triggered
* @param event Name of the event to add hook to (`onInit`, `onAjax`, ...)
* @param callback Function to call
* @param args Function arguments
* @returns Hook or null if event name is invalid
*/
function onHook(event: keyof Hooks, callback: Function, ...args: any[]): Hook|null {
    return axette.hooks.addHook(event, { callback: callback, args: args });
}

export default axette;
