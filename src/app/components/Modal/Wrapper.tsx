// Copyright 2017 The gachain-front Authors
// This file is part of the gachain-front library.
// 
// The gachain-front library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// The gachain-front library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
// 
// You should have received a copy of the GNU Lesser General Public License
// along with the gachain-front library. If not, see <http://www.gnu.org/licenses/>.

import * as React from 'react';
import Transition from 'react-transition-group/Transition';
import styled from 'styled-components';

const containerAnimationDuration = 210;
const containerAnimationDef = {
    defaultStyle: {
        transition: 'opacity .21s ease-in-out',
        opacity: 0
    },

    entering: {
        height: 'auto',
        display: 'block',
        opacity: 1
    },
    entered: {
        opacity: 1
    },

    exiting: {
        opacity: 0
    },

    exited: {
        height: 0,
        padding: 0,
        margin: 0,
        opacity: 0
    }
};

const childAnimationDuration = 210;
const childAnimationDef = {
    defaultStyle: {
        transform: 'translateY(-30px)',
        transition: 'transform .21s ease-in-out, opacity .21s ease-in-out',
        opacity: 0
    },

    entering: {
        transform: 'translateY(0)',
        opacity: 1
    },

    entered: {
        transform: 'translateY(0)',
        opacity: 1
    },

    exiting: {
        transform: 'translateY(30px)',
        opacity: 0
    }
};

const StyledModalWrapper = styled.div`
    background: rgba(0,0,0,0.3);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9000;
    text-align: center;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 50px;
    margin-top: ${props => props.style.marginTop}px;

    &::before {
        content: ' ';
        display: inline-block;
        height: 100%;
        width: 1px;
        vertical-align: middle;
        font-size: 0;
    }

    > .modal-wnd {
        display: inline-block;
        border: solid 1px #71a2e0;
        background: #fff;
        vertical-align: middle;
        text-align: initial;
        max-width: 95%;
        overflow: hidden;
    }
`;

export interface IModalWrapperProps {
    topOffset?: number;
}

interface IModalWrapperState {
    active: boolean;
    activeModal: React.ReactNode;
    queuedModal: React.ReactNode;
}

class ModalWrapper extends React.Component<IModalWrapperProps, IModalWrapperState> {
    private _exited = false;

    constructor(props: IModalWrapperProps) {
        super(props);
        this.state = {
            activeModal: null,
            queuedModal: null,
            active: false
        };
    }

    componentDidMount() {
        this.enqueueModal(this.props.children);
    }

    componentWillReceiveProps(props: IModalWrapperProps & { children: React.ReactNode }) {
        this.enqueueModal(props.children);
    }

    onEntered = () => {
        if (this.state.queuedModal) {
            this.setState({
                active: false
            });
        }
    }

    onExited = () => {
        this._exited = true;
        if (this.state.queuedModal) {
            this._exited = false;
            this.setState({
                active: true,
                activeModal: this.state.queuedModal,
                queuedModal: null
            });
        }
    }

    enqueueModal = (node: React.ReactNode) => {
        if (this.state.activeModal && !this._exited) {
            this.setState({
                active: false,
                queuedModal: node
            });
        }
        else if (node) {
            this._exited = false;
            this.setState({
                active: true,
                activeModal: node
            });
        }
        else {
            this.setState({
                active: false,
                activeModal: node
            });
        }
    }

    renderChild(state: string) {
        return (
            <div className="modal-wnd" style={{ ...childAnimationDef.defaultStyle, ...childAnimationDef[state] }}>
                {this.state.activeModal}
            </div>
        );
    }

    render() {
        return (
            <Transition in={this.state.active} timeout={containerAnimationDuration} onEntered={this.onEntered} onExited={this.onExited} unmountOnExit>
                {(state: string) => (
                    <StyledModalWrapper style={{ ...containerAnimationDef.defaultStyle, ...containerAnimationDef[state], marginTop: this.props.topOffset }}>
                        <Transition in={state === 'entered'} timeout={childAnimationDuration}>
                            {this.renderChild.bind(this)}
                        </Transition>
                    </StyledModalWrapper>
                )}
            </Transition >

        );
    }
}

export default ModalWrapper;