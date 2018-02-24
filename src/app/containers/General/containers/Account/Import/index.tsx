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
import { navigate } from 'modules/engine/actions';
import { importSeed, importAccount, login } from 'modules/auth/actions';
import { alertShow } from 'modules/content/actions';
import { IRootState } from 'modules';

import Import, { IImportProps } from 'components/General/Account/Import';

export interface IImportContainerProps {

}

interface IImportContainerState {
    isImportingAccount: boolean;
    importAccountError: string;
    loadedSeed: string;
}

interface IImportContainerDispatch {
    navigate: typeof navigate;
    alertShow: typeof alertShow;
    login: typeof login.started;
    importSeed: typeof importSeed.started;
    importAccount: typeof importAccount.started;
}

const ImportContainer: React.SFC<IImportProps> = (props) => {
    return (
        <Import {...props} return="/account" />
    );
};

const mapStateToProps = (state: IRootState) => ({
    isImportingAccount: state.auth.isImportingAccount,
    importAccountError: state.auth.importAccountError,
    loadedSeed: state.auth.loadedSeed
});

const mapDispatchToProps = {
    navigate,
    importSeed: importSeed.started,
    importAccount: importAccount.started,
    alertShow: alertShow,
    login: login.started
};

export default connect<IImportContainerState, IImportContainerDispatch, IImportContainerProps>(mapStateToProps, mapDispatchToProps)(ImportContainer);