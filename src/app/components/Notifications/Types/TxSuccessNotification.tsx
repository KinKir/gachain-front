/*---------------------------------------------------------------------------------------------
 *  Copyright (c) GACHAIN All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { INotificationProto } from 'gachain/notifications';
import { ITransactionCall } from 'gachain/tx';

const TxSuccessNotification: INotificationProto<{ block: string, tx: ITransactionCall }> = {
    icon: 'o-checkround-1',
    title: params => '', // params.tx.contract.name,
    body: params => (
        <FormattedMessage id="notification.tx_imprinted" defaultMessage="Imprinted in the blockchain (block {block})" values={{ block: params.block }} />
    )
};

export default TxSuccessNotification;