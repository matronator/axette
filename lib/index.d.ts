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
export declare class Hooks {
    onAjax: Array<Hook>;
    onInit: Array<Hook>;
    addInitHook(hook: Hook): Hook | null;
    addAjaxHook(hook: Hook): Hook | null;
    addHook(event: keyof Hooks, hook: Hook): Hook | null;
}
export declare const hooks: Hooks;
export declare function init(ajaxClass?: string): void;
export declare function onAjax(link: string, data?: BodyInit | null, contentType?: string): Promise<void>;
/**
* Removes `?_fid=xxxx` from the URL that Nette adds there whenever it shows a FlashMessage.
*/
export declare function noFlashURL(): void;
export declare function onAjaxHook(callback: Function, ...args: any[]): void;
export declare function onInitHook(callback: Function, ...args: any[]): void;
export declare function onHook(event: keyof Hooks, callback: Function, ...args: any[]): Hook | null;
declare const axette: {
    init: typeof init;
    onAjax: typeof onAjax;
    hooks: Hooks;
    onHook: typeof onHook;
    noFlashURL: typeof noFlashURL;
};
export default axette;
