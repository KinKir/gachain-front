/*---------------------------------------------------------------------------------------------
 *  Copyright (c) GACHAIN All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'gachain' {
    interface IFatalError {
        name: string;
        message: string;
    }

    interface ILocale {
        key: string;
        name: string;
        enabled: boolean;
    }
}