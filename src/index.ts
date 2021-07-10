/**
* Copyright (c) 2021 Matronator
*
* This software is released under the MIT License.
* https://opensource.org/licenses/MIT
*/

export type Hook = {
    fn: Function,
    args: any[],
}

export class Hooks {
    onAjax: Array<Hook> = []
    onInit: Array<Hook> = []

    addInitHook(hook: Hook): Hook|null {
        return this.addHook(`onInit`, hook)
    }

    addAjaxHook(hook: Hook): Hook|null {
        return this.addHook(`onAjax`, hook)
    }

    addHook(event: keyof Hooks, hook: Hook): Hook|null {
        switch(event) {
            case `onAjax`:
            this.onAjax.push(hook)
            return hook
            case `onInit`:
            this.onInit.push(hook)
            return hook
            default:
            if (this[event] instanceof Array) {
                Array.prototype.push.call(this[event], hook)
                return hook
            }
            return null
        }
    }
}

const hooks = new Hooks

const axette = { init, run: onAjax, hooks: hooks, on: onHook, onInit: onInitHook, onAjax: onAjaxHook, fixURL: noFlashURL }

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
function init(ajaxClass: string = `ajax`) {
    const links = document.querySelectorAll(`a.${ajaxClass}`)
    if (links) {
        links.forEach((link: Element) => {
            link.addEventListener(`click`, (e: Event) => {
                e.preventDefault()
                axette.run((e.target as HTMLAnchorElement).href)
            })
        })
    }

    const forms = document.querySelectorAll(`form.${ajaxClass}`)
    if (forms) {
        forms.forEach(form => {
            if (form instanceof HTMLFormElement) {
                form.addEventListener(`submit`, async (e) => {
                    e.preventDefault()
                    const body = new FormData(form)
                    if (form.method.toLowerCase() === `post`) {
                        axette.run(form.action, body, `application/form-multipart`, form as Element, `POST`)
                            .catch(err => console.error(err))
                    } else {
                        const formData = new FormData(form)
                        const params = (new URLSearchParams(String(formData))).toString()
                        axette.run(`${form.action}?${params}`)
                            .catch(err => console.error(err))
                    }

                    form.reset()
                })
            }
        })
    }

    axette.hooks.onInit.forEach((hook: Hook) => {
        if (hook.fn instanceof Function) {
            hook.fn(...hook.args)
        }
    })
}

/**
* Handles Nette response by updating snippets and/or redirecting if necessary
* @param link (string) Target URL
* @param requestBody (any) Request body
* @param contentType (string) `Content-Type` header (default: `application/json`)
* @param element (Element) The element that sent the event
* @param method (string) HTTP method (default: `POST`)
*/
async function onAjax(link: string, requestBody: any = null, contentType: string = `application/json`, element: Element|null = null, method: string = `POST`) {
    const formParent = element ? element.closest("form[data-ajax-parent]") : null
    const response = await fetch(link, {
        method: formParent ? "POST" : method,
        headers: { "X-Requested-With": "XMLHttpRequest" },
        body: requestBody as BodyInit,
    })

    const { snippets = {}, redirect = `` } = await response.json()
    if (redirect !== ``) {
        window.location.replace(redirect)
    }
    Object.entries(snippets).forEach(([id, html]) => {
        const elem = document.getElementById(id)
        if (elem) elem.innerHTML = html as string
    })

    axette.hooks.onAjax.forEach(hook => {
        if (hook.fn instanceof Function) {
            hook.fn(...hook.args)
        }
    })

    axette.init()
}

/**
* Removes `?_fid=xxxx` from the URL that Nette adds there whenever it shows a FlashMessage.
*/
function noFlashURL() {
    let l = window.location.toString()
    let fid = l.indexOf(`_fid=`)
    if(fid !== -1) {
        let uri: string = l.substr(0, fid) + l.substr(fid + 10)
        if ((uri.substr(uri.length - 1) === `?`) || (uri.substr(uri.length - 1) === `&`)) {
            uri = uri.substr(0, uri.length - 1)
        }
        window.history.replaceState(``, document.title, uri)
    }
}

function onAjaxHook(callback: Function, ...args: any[]) {
    axette.on(`onAjax`, callback, args)
}

function onInitHook(callback: Function, ...args: any[]) {
    axette.on(`onInit`, callback, args)
}

/**
* Add new callback to the specified event to be run every time that event is triggered
* @param event Name of the event to add hook to (`onInit`, `onAjax`, ...)
* @param callback Function to call
* @param args Function arguments
* @returns Hook or null if event name is invalid
*/
function onHook(event: keyof Hooks, callback: Function, ...args: any[]): Hook|null {
    return axette.hooks.addHook(event, { fn: callback, args: args })
}

export default axette
