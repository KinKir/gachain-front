/*---------------------------------------------------------------------------------------------
 *  Copyright (c) GACHAIN All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import actionCreatorFactory from 'typescript-fsa';
import { IWallet } from 'gachain/auth';
import { INotificationsMessage, IConnectCall } from 'gachain/socket';
import { IAccount } from 'gachain/api';
import Centrifuge from 'centrifuge';

const actionCreator = actionCreatorFactory('socket');
export const connect = actionCreator.async<IConnectCall, { session: string, instance: Centrifuge }, string>('CONNECT');
export const disconnect = actionCreator.async('DISCONNECT');
export const subscribe = actionCreator.async<IAccount, any, string>('SUBSCRIBE');
export const unsubscribe = actionCreator.async<IWallet, void, void>('UNSUBSCRIBE');
export const setNotifications = actionCreator<INotificationsMessage[]>('SET_NOTIFICATIONS');
export const setNotificationsCount = actionCreator<INotificationsMessage>('SET_NOTIFICATIONS_COUNT');
export const setConnected = actionCreator<boolean>('SET_CONNECTED');