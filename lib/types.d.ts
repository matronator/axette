/**
 * Copyright (c) 2021 Matronator
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
export declare type Hook = {
    fn: Function;
    args: any[];
};
export declare type AxetteSettings = {
    ajaxClass?: string;
    ajaxLinkClass?: string;
    ajaxFormClass?: string;
    removeFidFromURL?: boolean;
};
export declare class Hooks {
    onAjax: Array<Hook>;
    onInit: Array<Hook>;
    constructor();
    addOnInitHook(hook: Hook): Hook | null;
    addOnAjaxHook(hook: Hook): Hook | null;
    addHook(event: keyof Hooks, hook: Hook): Hook | null;
}
