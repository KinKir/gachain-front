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

import { IRootState } from 'modules';
import { connect } from 'react-redux';
import { logout, changePassword, switchWallet } from 'modules/auth/actions';
import { modalShow } from 'modules/modal/actions';

import UserMenu from 'components/Main/UserMenu';

const mapStateToProps = (state: IRootState) => ({
    isDefaultWallet: state.auth.isDefaultWallet,
    wallet: state.auth.wallet,
    walletEcosystems: ((state.auth.wallet && state.auth.wallet.wallet && state.auth.wallets) ? (state.auth.wallets.find(l => l.id === state.auth.wallet.wallet.id) || { access: [] }).access : []).sort((a, b) => Number(a.ecosystem) - Number(b.ecosystem))
});

const mapDispatchToProps = {
    onLogout: () => logout.started(null),
    onSwitchEcosystem: (ecosystem: string, defaultRole?: boolean) => defaultRole
        ? switchWallet({
            ecosystem,
            role: null
        })
        : modalShow({
            id: 'ROLE_PICKER',
            type: 'ROLE_PICKER',
            params: {
                ecosystem
            }
        }),
    onChangePassword: () => changePassword.started(null)
};

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(UserMenu);