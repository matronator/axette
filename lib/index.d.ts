/**
* Copyright (c) 2021 Matronator
*
* This software is released under the MIT License.
* https://opensource.org/licenses/MIT
*/
declare type Hook = {
    fn: Function;
    args: any[];
};
declare class Hooks extends Array {
    onAjax: Array<Hook>;
    onInit: Array<Hook>;
}
export declare const hooks: Hooks;
export declare function init(ajaxClass?: string): void;
export declare function onAjax(link: string, data?: BodyInit | null, contentType?: string): Promise<void>;
export declare function onAjaxHook(callback: Function, ...args: any[]): void;
export declare function onInitHook(callback: Function, ...args: any[]): void;
export declare function onHook(event: keyof Hooks, callback: Function, ...args: any[]): void;
export {};
