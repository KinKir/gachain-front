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

import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { connect } from 'react-redux';
import { IRootState } from 'modules';
import { modalShow } from 'modules/modal/actions';
import { changeEditorTab, closeEditorTab, updateEditorTab, loadEditorTab, createEditorTab } from 'modules/editor/actions';
import { TEditorTab } from 'gachain/editor';
import { IModalResult } from 'gachain/modal';

import Editor from 'components/Main/Editor';

interface IEditorContainerProps {
    open?: string;
    create?: string;
    name?: string;
    appId?: number;
}

interface IEditorContainerState {
    tabIndex: number;
    tabs: TEditorTab[];
    modalResult: IModalResult;
}

interface IEditorContainerDispatch {
    modalShow: typeof modalShow;
    onTabCreate: typeof createEditorTab.started;
    onTabLoad: typeof loadEditorTab.started;
    onTabChange: typeof changeEditorTab;
    onTabClose: typeof closeEditorTab;
    onTabUpdate: typeof updateEditorTab;
}

class EditorContainer extends React.Component<IEditorContainerProps & InjectedIntlProps & IEditorContainerState & IEditorContainerDispatch> {
    private _pendingClose: number;

    constructor(props: IEditorContainerProps & InjectedIntlProps & IEditorContainerState & IEditorContainerDispatch) {
        super(props);

        if (props.open && props.name) {
            props.onTabLoad({
                type: props.open,
                name: props.name
            });
        }
        else if (props.appId && props.create) {
            props.onTabCreate({
                type: props.create,
                appId: props.appId
            });
        }
    }

    componentWillReceiveProps(props: IEditorContainerProps & IEditorContainerState & IEditorContainerDispatch) {
        if ('number' === typeof this._pendingClose && props.modalResult) {
            if ('RESULT' === props.modalResult.reason) {
                this.props.onTabClose(this._pendingClose);
            }

            this._pendingClose = null;
        }

        if (props.open && props.name && (this.props.open !== props.open || this.props.name !== props.name)) {
            props.onTabLoad({
                type: props.open,
                name: props.name
            });
        }

        if (props.appId && props.create && (this.props.appId !== props.appId && this.props.create !== props.create)) {
            props.onTabCreate({
                type: props.create,
                appId: props.appId
            });
        }
    }

    onTabClose = (index: number) => {
        const tab = this.props.tabs[index];

        if (tab.dirty) {
            this._pendingClose = index;
            this.props.modalShow({
                id: 'EDITOR_CLOSE',
                type: 'CONFIRM',
                params: {
                    description: this.props.intl.formatMessage({
                        id: 'editor.close.confirm',
                        defaultMessage: 'Do you really want to close \'{name}\' without saving changes?'
                    }, { name: tab.name })
                }
            });
        }
        else {
            this.props.onTabClose(index);
        }
    }

    render() {
        return (
            <Editor
                tabIndex={this.props.tabIndex}
                tabs={this.props.tabs}
                onTabChange={this.props.onTabChange}
                onTabUpdate={this.props.onTabUpdate}
                onTabClose={this.onTabClose}
            />
        );
    }
}

const mapStateToProps = (state: IRootState) => ({
    tabIndex: state.editor.tabIndex,
    tabs: state.editor.tabs,
    modalResult: state.modal.result
});

const mapDispatchToProps = {
    modalShow: modalShow,
    onTabCreate: createEditorTab.started,
    onTabLoad: loadEditorTab.started,
    onTabChange: changeEditorTab,
    onTabClose: closeEditorTab,
    onTabUpdate: updateEditorTab,
};

export default connect<IEditorContainerState, IEditorContainerDispatch, IEditorContainerProps>(mapStateToProps, mapDispatchToProps)(injectIntl(EditorContainer));