/*---------------------------------------------------------------------------------------------
 *  Copyright (c) GACHAIN All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'gachain/content' {
    import { TProtypoElement } from 'gachain/protypo';

    type TMenu = {
        readonly name: string;
        readonly content: TProtypoElement[];
    };

    type TPage = {
        readonly name: string;
        readonly legacy?: boolean;
        readonly content: TProtypoElement[];
        readonly params: { [key: string]: any };
        readonly error?: string;
    };

    type TSection = {
        readonly key: string;
        readonly visible: boolean;
        readonly closeable?: boolean;
        readonly menuDisabled?: boolean;
        readonly menuVisible: boolean;
        readonly pending: boolean;
        readonly name: string;
        readonly title: string;
        readonly force: boolean;
        readonly defaultPage: string;
        readonly menus: TMenu[];
        readonly page: TPage;
    }
}