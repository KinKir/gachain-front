// MIT License
// 
// Copyright (c) 2016-2019 GACHAIN
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
import { connect } from 'react-redux';
import { IRootState } from 'modules';
import { getPageTree, selectTag, changePage, saveConstructorHistory, constructorUndo, constructorRedo, setTagCanDropPosition, addTag, copyTag, moveTag, removeTag, moveTreeTag } from 'modules/editor/actions';
import Constructor from 'components/Main/Editor/Designer';
import { TProtypoElement } from 'gachain/protypo';
import { generatePageTemplate } from 'modules/editor/actions';
import { IChangePageCall, TConstructorData, IAddTagCall, IOperateTagCall, IMoveTreeTag, ISetTagCanDropPositionCall } from 'gachain/editor';

export interface IConstructorTabbedContainerProps {
    pageID: string;
    pageName: string;
    menus?: { id: string, name: string, conditions: string, value: string }[];
    onSave?: (pageID: string) => void;
    random?: number;
}

interface IConstructorTabbedContainerState {
    data?: TConstructorData;
    history?: {
        data: TProtypoElement[][],
        position?: number,
        canUndo?: boolean,
        canRedo?: boolean
    };
}

interface IConstructorTabbedContainerDispatch {
    getPageTree: typeof getPageTree.started;
    changePage: typeof changePage.started;
    setTagCanDropPosition: typeof setTagCanDropPosition.started;
    addTag: typeof addTag.started;
    moveTag: typeof moveTag.started;
    moveTreeTag: typeof moveTreeTag;
    copyTag: typeof copyTag.started;
    removeTag: typeof removeTag.started;
    selectTag: typeof selectTag.started;
    constructorUndo: typeof constructorUndo.started;
    constructorRedo: typeof constructorRedo.started;
    saveConstructorHistory: typeof saveConstructorHistory.started;
    generatePageTemplate: typeof generatePageTemplate;
}

interface IConstructorTabbedState {
    grid: boolean;
    logic: boolean;
    canSave: boolean;
}

class ConstructorTabbedContainer extends React.Component<IConstructorTabbedContainerProps & IConstructorTabbedContainerState & IConstructorTabbedContainerDispatch, IConstructorTabbedState> {
    constructor(props: IConstructorTabbedContainerProps & IConstructorTabbedContainerState & IConstructorTabbedContainerDispatch) {
        super(props);
        this.state = {
            grid: true,
            logic: true,
            canSave: false
        };
    }

    changePage(payload: IChangePageCall) {
        this.props.changePage(payload);
        this.props.saveConstructorHistory(null);
        this.generatePageTemplate();
    }

    addTag(payload?: IAddTagCall) {
        this.props.addTag(payload);
        this.props.saveConstructorHistory(null);
        this.generatePageTemplate();
    }

    moveTag(payload?: IOperateTagCall) {
        this.props.moveTag(payload);
        this.props.saveConstructorHistory(null);
        this.generatePageTemplate();
    }

    moveTreeTag(payload?: IMoveTreeTag) {
        this.props.moveTreeTag(payload);
        this.generatePageTemplate();
    }

    copyTag(payload?: IOperateTagCall) {
        this.props.copyTag(payload);
        this.props.saveConstructorHistory(null);
        this.generatePageTemplate();
    }

    removeTag(payload?: IOperateTagCall) {
        this.props.removeTag(payload);
        this.props.saveConstructorHistory(null);
        this.generatePageTemplate();
    }

    setTagCanDropPosition(payload?: ISetTagCanDropPositionCall) {
        this.props.setTagCanDropPosition(payload);
    }

    selectTag(payload: any) {
        this.props.selectTag(payload);
    }

    toggleGrid() {
        this.setState({
            ...this.state,
            grid: !this.state.grid
        });
    }

    toggleLogic() {
        this.setState({
            ...this.state,
            logic: !this.state.logic
        });
    }

    undo() {
        this.props.constructorUndo(null);
        this.generatePageTemplate();
    }

    redo() {
        this.props.constructorRedo(null);
        this.generatePageTemplate();
    }

    onSave(block: string, error?: { type: string, error: string }) {
        if (this.props.onSave) {
            this.props.onSave(this.props.pageID);
        }
    }

    generatePageTemplate() {
        this.props.generatePageTemplate(this.props.pageID);
    }

    render() {
        const data = this.props.data;
        const history = this.props.history;

        const jsonData = data && data.jsonData || [];
        const treeData = data && data.treeData || [];
        const pageTemplate = data && data.pageTemplate || null;
        const selectedTag = data && data.selectedTag || null;

        const canUndo = history && history.canUndo || false;
        const canRedo = history && history.canRedo || false;

        return (
            <Constructor
                pageTree={jsonData}
                treeData={treeData}
                changePage={this.changePage.bind(this)}
                setTagCanDropPosition={this.setTagCanDropPosition.bind(this)}
                selectTag={this.selectTag.bind(this)}
                addTag={this.addTag.bind(this)}
                moveTag={this.moveTag.bind(this)}
                moveTreeTag={this.moveTreeTag.bind(this)}
                copyTag={this.copyTag.bind(this)}
                removeTag={this.removeTag.bind(this)}
                selectedTag={selectedTag}
                grid={this.state.grid}
                logic={this.state.logic}
                toggleGrid={this.toggleGrid.bind(this)}
                toggleLogic={this.toggleLogic.bind(this)}
                undo={this.undo.bind(this)}
                redo={this.redo.bind(this)}
                canUndo={canUndo}
                canRedo={canRedo}
                pageTemplate={pageTemplate}
            />
        );
    }
}

const mapStateToProps = (state: IRootState) => {
    const currentTab = state.editor.tabs[state.editor.tabIndex];

    return {
        data: currentTab.designer && currentTab.designer.data || null,
        history: currentTab.designer && currentTab.designer.history || null
    };
};

const mapDispatchToProps = {
    getPageTree: getPageTree.started,
    changePage: changePage.started,
    setTagCanDropPosition: setTagCanDropPosition.started,
    addTag: addTag.started,
    moveTag: moveTag.started,
    moveTreeTag,
    copyTag: copyTag.started,
    removeTag: removeTag.started,
    selectTag: selectTag.started,
    constructorUndo: constructorUndo.started,
    constructorRedo: constructorRedo.started,
    saveConstructorHistory: saveConstructorHistory.started,
    generatePageTemplate
};

export default connect<IConstructorTabbedContainerState, IConstructorTabbedContainerDispatch, IConstructorTabbedContainerProps>(mapStateToProps, mapDispatchToProps)(ConstructorTabbedContainer);
