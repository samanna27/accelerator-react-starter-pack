import {
  ThunkAction,
  ThunkDispatch
} from 'redux-thunk';
import {
  AxiosInstance
} from 'axios';
import {State} from '../types/state';

import {
  loadGuitars,
  loadGuitarComments,
  redirectToRoute,
  changeSortType,
  changeOrderType
} from '../store/action';

export enum ActionType {
  LoadGuitars = 'data/loadGuitars',
  LoadGuitarComments = 'data/loadGuitarComments',
  RedirectToRoute = 'main/redirectToRoute',
  ChangeSortType = 'data/changeSortType',
  ChangeOrderType = 'data/changeOrderType'
}

export type Actions =
 | ReturnType<typeof loadGuitars>
 | ReturnType<typeof loadGuitarComments>
 | ReturnType<typeof redirectToRoute>
 | ReturnType<typeof changeSortType>
 | ReturnType<typeof changeOrderType>;

export type ThunkActionResult<R = Promise<void>> = ThunkAction<R, State, AxiosInstance, Actions>;

export type ThunkAppDispatch = ThunkDispatch<State, AxiosInstance, Actions>;
