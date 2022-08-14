type HookCallback = (...args: unknown[]) => unknown;

interface Hook {
    id: string;
    callback: HookCallback;
    args: unknown[];
}

enum HookType {
    OnInit = `onInit`,
    OnAjax = `onAjax`,
}

interface GlobalHooks {
    onInit: Hook[];
    onAjax: Hook[];
    initialized: boolean;
}

declare global {
    interface Window {
        __AxetteGlobalHooks: GlobalHooks;
    }
}

export class Axette {
    private hasCryptoLib: boolean;

    constructor(ajaxClass: string = `ajax`) {
        const globalCallbacks: GlobalHooks = {
            onInit: [],
            onAjax: [],
            initialized: true,
        };
        if (!window.__AxetteGlobalHooks || !window.__AxetteGlobalHooks.initialized) {
            window.__AxetteGlobalHooks = globalCallbacks;
        }

        this.hasCryptoLib = this.hasCrypto();

        this.init(ajaxClass);
    }

    init(ajaxClass: string = `ajax`) {
        const links = document.querySelectorAll(`a.${ajaxClass}`);
        links?.forEach((link: Element) => {
            link.addEventListener(`click`, (e: Event) => {
                e.preventDefault();
                this.run((e.target as HTMLAnchorElement).href);
            });
        });

        const forms = document.querySelectorAll(`form.${ajaxClass}`);
        forms?.forEach(form => {
            const htmlForm = form as HTMLFormElement;
            form.addEventListener(`submit`, async (e) => {
                e.preventDefault();
                const body = new FormData(htmlForm);
                if (htmlForm.method.toLowerCase() === `post`) {
                    this.run(htmlForm.action, body, `application/form-multipart`, form, `POST`)
                        .catch(err => console.error(err));
                } else {
                    const params = (new URLSearchParams(String(body))).toString();
                    this.run(`${htmlForm.action}?${params}`)
                        .catch(err => console.error(err));
                }

                htmlForm.reset();
            });
        });

        window.__AxetteGlobalHooks.onInit.forEach((hook: Hook) => {
            if (hook.callback instanceof Function) {
                hook.callback(hook.args);
            }
        });
    }

    async run(
        link: string,
        requestBody: BodyInit | null = null,
        contentType = `application/json`,
        element: Element | null = null,
        method = `POST`
    ) {
        const formParent = element ? element.closest("form[data-ajax-parent]") : null;
        const response = await fetch(link, {
            method: formParent ? `POST` : method,
            headers: {
                'X-Requested-With': `XMLHttpRequest`,
                'Content-Type': contentType,
            },
            body: (requestBody as BodyInit),
        });

        const { snippets = {}, redirect = `` } = await response.json();
        if (redirect !== ``) {
            window.location.replace(redirect);
        }
        Object.entries(snippets).forEach(([id, html]) => {
            const elem = document.getElementById(id);
            if (elem) elem.innerHTML = html as string;
        });

        window.__AxetteGlobalHooks.onAjax.forEach((hook: Hook) => {
            if (hook.callback instanceof Function) {
                hook.callback(hook.args);
            }
        });

        this.init();
    }

    fixURL() {
        let l = window.location.toString();
        let fid = l.indexOf(`_fid=`);
        if (fid !== -1) {
            let uri: string = l.substr(0, fid) + l.substr(fid + 10);
            if ((uri.substr(uri.length - 1) === `?`) || (uri.substr(uri.length - 1) === `&`)) {
                uri = uri.substr(0, uri.length - 1);
            }
            window.history.replaceState(``, document.title, uri);
        }
    }

    on(event: HookType, callback: HookCallback, ...args: unknown[]): string {
        const hook: Hook = {
            id: this.generateHookID(event),
            callback: callback,
            args: args,
        };

        window.__AxetteGlobalHooks[event].push(hook);

        return hook.id;
    }

    off(event: HookType, id: string): boolean {
        const index = window.__AxetteGlobalHooks[event].findIndex((item: Hook) => item.id === id);
        if (index === -1) {
            return false;
        }

        window.__AxetteGlobalHooks[event].splice(index, 1);
        return true;
    }

    onInit(callback: HookCallback, ...args: unknown[]): string {
        return this.on(HookType.OnInit, callback, ...args);
    }

    onAjax(callback: HookCallback, ...args: unknown[]): string {
        return this.on(HookType.OnAjax, callback, ...args);
    }

    offInit(id: string): boolean {
        return this.off(HookType.OnInit, id);
    }

    offAjax(id: string): boolean {
        return this.off(HookType.OnAjax, id);
    }

    private generateHookID(event: HookType): string {
        let id = '';

        if (this.hasCryptoLib) {
            const arr = new Uint32Array(2);
            id = (crypto.getRandomValues(arr)[0].toString(36) + crypto.getRandomValues(arr)[1].toString(36)).substring(0, 10);
        } else {
            id = ((performance.now() * Math.random()).toString(36) + '0000000000').replace('.', '').substring(0, 10);
        }

        if (window.__AxetteGlobalHooks[event].findIndex((item: Hook) => item.id === id) !== -1) {
            return this.generateHookID(event);
        }

        return id;
    }

    private hasCrypto(): boolean {
        return typeof(window.crypto) !== undefined && typeof(window.crypto.getRandomValues) !== undefined;
    }
}
