/**
 * Copyright (c) 2021 Matronator
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Hooks, AxetteSettings } from "../types";
export declare class Axette {
    settings: AxetteSettings;
    hooks: Hooks;
    constructor(settings?: AxetteSettings);
    init(): void;
    onAjax(link: string, data?: BodyInit | null, contentType?: string): Promise<void>;
}
