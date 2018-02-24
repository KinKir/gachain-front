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
import { connect } from 'react-redux';
import { IRootState } from 'modules';
import { getBlock } from 'modules/admin/actions';

import EditBlock from 'components/Main/Admin/Interface/EditBlock';

export interface IEditBlockContainerProps {
    vde?: boolean;
    // match?: { params: { blockID: string } };
    blockID: string;
}

interface IEditBlockContainerState {
    // block: { id: string, name: string, value: string, conditions: string };
    tabData: any;
}

interface IEditBlockContainerDispatch {
    getBlock: typeof getBlock.started;
}

class EditBlockContainer extends React.Component<IEditBlockContainerProps & IEditBlockContainerState & IEditBlockContainerDispatch> {
    componentWillMount() {
        this.props.getBlock({
            id: this.props.blockID,
            vde: this.props.vde
        });
    }

    render() {
        const blockTab = this.props.tabData && this.props.tabData['interfaceBlock' + this.props.blockID + (this.props.vde ? '-vde' : '')] || null;
        let block = null;
        if (blockTab) {
            block = blockTab.data;
        }

        return (
            <EditBlock block={block} tabView={true} />
        );
    }
}

const mapStateToProps = (state: IRootState) => ({
    // block: state.admin.block
    tabData: state.admin.tabs && state.admin.tabs.data || null,
});

const mapDispatchToProps = {
    getBlock: getBlock.started
};

export default connect<IEditBlockContainerState, IEditBlockContainerDispatch, IEditBlockContainerProps>(mapStateToProps, mapDispatchToProps)(EditBlockContainer);