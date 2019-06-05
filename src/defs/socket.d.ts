/*---------------------------------------------------------------------------------------------
 *  Copyright (c) GACHAIN All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'gachain/socket' {
    interface INotificationsMessage {
        id: string;
        ecosystem: string;
        role: number;
        count: number;
    }

    interface IConnectCall {
        wsHost: string;
        userID: string;
        socketToken: string;
        session: string;
        timestamp: string;
    }
}