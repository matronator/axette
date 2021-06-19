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
declare const axette: {
    init: typeof init;
    run: typeof onAjax;
    hooks: Hooks;
    on: typeof onHook;
    onInit: typeof onInitHook;
    onAjax: typeof onAjaxHook;
    fixURL: typeof noFlashURL;
};
/**
 * Registers AJAX handlers
 * @param ajaxClass CSS class to be used as selector for links and forms to be handled by AJAX
 */
declare function init(ajaxClass?: string): void;
/**
 * Handles Nette response by updating snippets and/or redirecting if necessary
 * @param link Target URL
 * @param data Request body
 * @param contentType `Content-Type` header
 */
declare function onAjax(link: string, data?: BodyInit | null, contentType?: string): Promise<void>;
/**
* Removes `?_fid=xxxx` from the URL that Nette adds there whenever it shows a FlashMessage.
*/
declare function noFlashURL(): void;
declare function onAjaxHook(callback: Function, ...args: any[]): void;
declare function onInitHook(callback: Function, ...args: any[]): void;
/**
 * Add new callback to the specified event to be run every time that event is triggered
 * @param event Name of the event to add hook to (`onInit`, `onAjax`, ...)
 * @param callback Function to call
 * @param args Function arguments
 * @returns Hook or null if event name is invalid
 */
declare function onHook(event: keyof Hooks, callback: Function, ...args: any[]): Hook | null;
export default axette;
