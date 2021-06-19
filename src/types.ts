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

export type AxetteSettings = {
    ajaxClass?: string,
    ajaxLinkClass?: string,
    ajaxFormClass?: string,
    removeFidFromURL?: boolean,
}

export class Hooks {
    onAjax: Array<Hook> = []
    onInit: Array<Hook> = []

    public constructor() {
        // super()
        return this
    }

    public addOnInitHook(hook: Hook): Hook|null {
        return this.addHook(`onInit`, hook)
    }

    public addOnAjaxHook(hook: Hook): Hook|null {
        return this.addHook(`onAjax`, hook)
    }

    public addHook(event: keyof Hooks, hook: Hook): Hook|null {
        if ((this[event] as Array<Hook>) instanceof Array) {
            // this[event].push(hook)
            return hook
        } else {
            return null
        }
    }
}
