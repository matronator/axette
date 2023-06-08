/**
* Copyright (c) 2021 Matronator
*
* This software is released under the MIT License.
* https://opensource.org/licenses/MIT
*/

export interface Hook {
    callback: Function;
    args?: any[];
    id?: string;
}

export type HookEvents = 'beforeAjax' | 'afterAjax' | 'beforeInit' | 'afterInit';

export class Hooks {
    public beforeAjax: Hook[] = [];
    public afterAjax: Hook[] = [];
    public beforeInit: Hook[] = [];
    public afterInit: Hook[] = [];

    addBeforeAjax(hook: Hook): Hook|null { return this.add('beforeAjax', hook); }
    addAfterAjax(hook: Hook): Hook|null { return this.add('afterAjax', hook); }
    addBeforeInit(hook: Hook): Hook|null { return this.add('beforeInit', hook); }
    addAfterInit(hook: Hook): Hook|null { return this.add('afterInit', hook); }

    add(event: HookEvents, hook: Hook): Hook|null {
        if (this[event].findIndex(h => h.id === hook.id) > -1) {
            return null;
        }
        this[event].push(hook);
        return hook;
    }

    remove(event: HookEvents, hook: Hook): void {
        const index = this[event].indexOf(hook);
        if (index > -1) {
            this[event].splice(index, 1);
        }
    }

    removeById(event: HookEvents, id: string) {
        const index = this[event].findIndex(hook => hook.id === id);
        if (index > -1) {
            this[event].splice(index, 1);
        }
    }
}

export class Axette {
    public hooks: Hooks = new Hooks;
    private linkHandler = this.handleLinkClick.bind(this);
    private formHandler = this.handleFormSubmit.bind(this);
    private selector: string = `.ajax`;

    constructor(selector: string = `.ajax`) {
        this.selector = selector;
        this.init();
    }

    setSelector(selector: string) {
        this.removeOldHandlers();
        this.selector = selector;
        this.init();
    }

    onBeforeAjax(callback: Function, args?: any[], id?: string): Hook|null { return this.hooks.addBeforeAjax({ callback, args, id }); }
    onAfterAjax(callback: Function, args?: any[], id?: string): Hook|null { return this.hooks.addAfterAjax({ callback, args, id }); }
    onBeforeInit(callback: Function, args?: any[], id?: string): Hook|null { return this.hooks.addBeforeInit({ callback, args, id }); }
    onAfterInit(callback: Function, args?: any[], id?: string): Hook|null { return this.hooks.addAfterInit({ callback, args, id }); }

    /**
    * Add new callback to the specified event to be run every time that event is triggered
    * @param event Name of the event to add hook to (`onBeforeInit`, `onAfterAjax`, ...)
    * @param callback Function to call
    * @param args (optional) Function arguments
    * @param id (optional) ID of the hook
    * @returns Hook or null if event name is invalid
    */
    on(event: HookEvents, callback: Function, args?: any[], id?: string): Hook|null {
        return this.hooks.add(event, { callback, args, id });
    }

    /**
     * Remove hook from the specified event. If no hook, function or ID is provided, all hooks for that event will be removed.
     **/
    off(event: HookEvents, hook?: Function): void;
    off(event: HookEvents, hook?: string): void;
    off(event: HookEvents, hook?: Hook): void;
    off(event: HookEvents, hook?: Hook|Function|string|null): void {
        if (typeof hook === `string`) {
            this.hooks.removeById(event, hook);
        } else if (typeof hook === 'function') {
            const toDelete = this.hooks[event].find(h => h.callback === hook);
            if (toDelete) {
                this.hooks.remove(event, toDelete);
            }
        } else if (hook && hook.callback !== undefined) {
            this.hooks.remove(event, hook);
        } else if (hook === undefined) {
            this.hooks[event] = [];
        } else {
            throw new TypeError(`Second argument is invalid.`, { cause: hook });
        }
    }

    private handleLinkClick(e: Event) {
        e.preventDefault();
        this.handleAjax((e.currentTarget as HTMLAnchorElement).href);
    }

    private handleFormSubmit(e: Event) {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const body = new FormData(form);
        if (form.method.toLowerCase() === `post`) {
            this.handleAjax(form.action, 'POST', body, {'Content-Type': `application/form-multipart`}, form as Element).catch(err => console.error(err));
        } else {
            const formData = new FormData(form);
            const params = (new URLSearchParams(String(formData))).toString();
            this.handleAjax(`${form.action}?${params}`).catch(err => console.error(err));
        }

        form.reset();
    }

    private removeOldHandlers() {
        const links = document.querySelectorAll(`a${this.selector}`) as NodeListOf<HTMLAnchorElement>;
        if (links) {
            links.forEach((link: HTMLAnchorElement) => {
                link.removeEventListener(`click`, this.linkHandler, true);
            });
        }

        const forms = document.querySelectorAll(`form${this.selector}`) as NodeListOf<HTMLFormElement>;
        if (forms) {
            forms.forEach(form => {
                form.removeEventListener(`submit`, this.formHandler, true);
            });
        }
    }

    init(afterAjax: boolean = false) {
        if (!afterAjax) {
            this.hooks.beforeInit.forEach((hook: Hook) => {
                hook.callback(...hook.args || []);
            });
        } else {
            this.removeOldHandlers();
        }

        const links = document.querySelectorAll(`a${this.selector}`);
        if (links) {
            links.forEach((link: Element) => {
                link.addEventListener(`click`, this.linkHandler, true);
            });
        }

        const forms = document.querySelectorAll(`form${this.selector}`) as NodeListOf<HTMLFormElement>;
        if (forms) {
            forms.forEach(form => {
                form.addEventListener(`submit`, this.formHandler, true);
            });
        }

        if (!afterAjax) {
            this.hooks.afterInit.forEach((hook: Hook) => {
                hook.callback(...hook.args || []);
            });
        }
    }

    /**
    * Handles Nette response by updating snippets and/or redirecting if necessary
    * @param url (string) Target URL
    * @param method (string) HTTP method (default: `POST`)
    * @param requestBody (any) Request body
    * @param headers (string) `Content-Type` header (default: `application/json`)
    * @param element (Element) The element that sent the event
    */
    private async handleAjax(url: string, method: string = `POST`, requestBody?: BodyInit|null, headers: {[key: string]: string} = {'Content-Type': `application/json`}, element: Element|null = null) {
        this.hooks.beforeAjax.forEach(hook => {
            hook.callback(...hook.args || []);
        });

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
            const snippetEl = document.getElementById(id);
            if (!snippetEl) return;
            snippetEl.querySelectorAll(`a${this.selector}`).forEach(el => {
                el.removeEventListener(`click`, this.linkHandler, true);
            });
            snippetEl.querySelectorAll(`form${this.selector}`).forEach(el => {
                el.removeEventListener(`submit`, this.formHandler, true);
            });
            setHtml(id, html as string);
        });

        this.hooks.afterAjax.forEach(hook => {
            hook.callback(...hook.args || []);
        });

        this.init(true);
    }

    sendRequest(url: string, method: string = `POST`, requestBody?: BodyInit|null, headers: {[key: string]: string} = {'Content-Type': `application/json`}) {
        return this.handleAjax(url, method, requestBody, headers);
    }

    async get(url: string, method: string = `GET`, options: {[key: string]: unknown} = {}) {
        const res = await fetch(url, {
            method: method,
            ...options,
        });
        return await res.json();
    }
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
export function fixUrl() {
    const l = window.location.toString();
    const fid = l.indexOf(`_fid=`);
    if(fid !== -1) {
        let uri: string = l.substring(0, fid) + l.substring(fid + 10);
        if ((uri.substring(uri.length - 1) === `?`) || (uri.substring(uri.length - 1) === `&`)) {
            uri = uri.substring(0, uri.length - 1);
        }
        window.history.replaceState(``, document.title, uri);
    }
}
