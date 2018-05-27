// MIT License
// 
// Copyright (c) 2016-2018 GACHAIN
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import React from 'react';
import { IModal, TModalResultReason } from 'gachain/modal';

import Wrapper from 'components/Modal/Wrapper';
import DebugContractModal from 'components/Modal/Editor/DebugContractModal';
import PromptModal from 'components/Modal/PromptModal';
import ImageEditorModal from 'components/Modal/ImageEditorModal';
import MapEditorModal from 'components/Modal/MapEditorModal';
import AboutModal from 'components/Modal/AboutModal';
import InfoModal from 'components/Modal/InfoModal';
import ErrorModal from 'components/Modal/ErrorModal';
import ConfirmModal from 'components/Modal/ConfirmModal';
import CreatePageModal from 'components/Modal/Editor/CreatePageModal';
import CreateInterfaceModal from 'components/Modal/Editor/CreateInterfaceModal';
import AuthorizeModal from 'components/Modal/Tx/AuthorizeModal';
import SignatureModal from 'components/Modal/Tx/SignatureModal';
import TxErrorModal from 'components/Modal/Tx/ErrorModal';
import AuthErrorModal from 'components/Modal/Auth/AuthErrorModal';
import AuthRemoveWalletModal from 'components/Modal/Auth/AuthRemoveWalletModal';
import TxConfirmModal from './Tx/ConfirmModal';

const MODAL_COMPONENTS = {
    'AUTHORIZE': AuthorizeModal,
    'AUTH_ERROR': AuthErrorModal,
    'AUTH_REMOVE_WALLET': AuthRemoveWalletModal,
    'TX_CONFIRM': TxConfirmModal,
    'TX_ERROR': TxErrorModal,
    'TX_SIGNATURE': SignatureModal,
    'CREATE_PAGE': CreatePageModal,
    'CREATE_INTERFACE': CreateInterfaceModal,
    'DEBUG_CONTRACT': DebugContractModal,
    'IMAGE_EDITOR': ImageEditorModal,
    'MAP_EDITOR': MapEditorModal,
    'PROMPT': PromptModal,
    'CONFIRM': ConfirmModal,
    'INFO': InfoModal,
    'ERROR': ErrorModal,
    'ABOUT': AboutModal
};

export interface IModalProviderProps {
    modal: IModal;
    onResult: (params: { reason: TModalResultReason, data: any }) => void;
}

class ModalProvider extends React.Component<IModalProviderProps> {
    onResult(data: any) {
        this.props.onResult({
            reason: 'RESULT',
            data
        });
    }

    onCancel() {
        this.props.onResult({
            reason: 'CANCEL',
            data: null
        });
    }

    render() {
        const Modal = this.props.modal && !this.props.modal.result && MODAL_COMPONENTS[this.props.modal.type] || null;
        return (
            <Wrapper>
                {Modal && (
                    <Modal
                        key={this.props.modal.id}
                        active
                        onResult={this.onResult.bind(this)}
                        onCancel={this.onCancel.bind(this)}
                        {...this.props.modal}
                    />
                )}
            </Wrapper>
        );
    }
}

export default ModalProvider;