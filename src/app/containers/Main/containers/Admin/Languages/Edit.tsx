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
import { getLanguage } from 'modules/admin/actions';

import DataPreloader from 'components/Animation/DataPreloader';
import Edit from 'components/Main/Admin/Languages/Edit';

export interface IEditContainerProps {
    translationID: string;
}

interface IEditContainerState {
    translation: { id: string, res: any, name: string, conditions: string };
}

interface IEditContainerDispatch {
    getLanguage: typeof getLanguage.started;
}

class EditContainer extends React.Component<IEditContainerProps & IEditContainerState & IEditContainerDispatch> {
    componentDidMount() {
        this.props.getLanguage({
            id: this.props.translationID
        });
    }

    componentWillReceiveProps(props: IEditContainerProps & IEditContainerState & IEditContainerDispatch) {
        if (this.props.translationID !== props.translationID) {
            props.getLanguage({
                id: props.translationID
            });
        }
    }

    render() {
        return (
            <DataPreloader data={[this.props.translation]}>
                <Edit translation={this.props.translation} />
            </DataPreloader>
        );
    }
}

const mapStateToProps = (state: IRootState) => ({
    translation: state.admin.language
});

const mapDispatchToProps = {
    getLanguage: getLanguage.started
};

export default connect<IEditContainerState, IEditContainerDispatch, IEditContainerProps>(mapStateToProps, mapDispatchToProps)(EditContainer);