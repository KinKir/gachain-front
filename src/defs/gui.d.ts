/*---------------------------------------------------------------------------------------------
 *  Copyright (c) GACHAIN All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'gachain/gui' {
    type TWindowType =
        'general' | 'main';

    interface IInferredArguments {
        readonly privateKey?: string;
        readonly fullNode?: string[];
        readonly networkID?: number;
        readonly networkName?: string;
        readonly dry?: boolean;
        readonly offsetX?: number;
        readonly offsetY?: number;
        readonly socketUrl?: string;
        readonly disableFullNodesSync?: boolean;
        readonly activationEmail?: string;
        readonly guestMode?: boolean;
    }
}