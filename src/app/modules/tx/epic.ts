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

import { combineEpics } from 'redux-observable';
import txCallEpic from './epics/txCallEpic';
import txAuthorizeEpic from './epics/txAuthorizeEpic';
import txPrepareEpic from './epics/txPrepareEpic';
import txExecEpic from './epics/txExecEpic';
import newEcosystemEpic from './epics/newEcosystemEpic';
import txExecFailedEpic from './epics/txExecFailedEpic';

export default combineEpics(
    txCallEpic,
    txAuthorizeEpic,
    txPrepareEpic,
    txExecEpic,
    txExecFailedEpic,
    newEcosystemEpic
);