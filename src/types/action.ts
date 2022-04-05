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
  changeOrderType,
  updateMinPriceFilter,
  setMaxPriceFilter,
  updateGuitarTypeFilter,
  updateStringsTypeFilter,
  updateCardsRendered,
  updateCommentsRendered
} from '../store/action';

export enum ActionType {
  LoadGuitars = 'data/loadGuitars',
  LoadGuitarComments = 'data/loadGuitarComments',
  RedirectToRoute = 'main/redirectToRoute',
  ChangeSortType = 'data/changeSortType',
  ChangeOrderType = 'data/changeOrderType',
  UpdateMinPriceFilter = 'data/updateMinPriceFilter',
  SetMaxPriceFilter = 'data/setMaxPriceFilter',
  UpdateGuitarTypeFilter = 'data/updateGuitarTypeFilter',
  UpdateStringsTypeFilter = 'data/updateStringsTypeFilter',
  UpdateCardsRendered = 'data/updateCardsRendered',
  UpdateCommentsRendered = 'data/updateCommentsRendered'
}

export type Actions =
 | ReturnType<typeof loadGuitars>
 | ReturnType<typeof loadGuitarComments>
 | ReturnType<typeof redirectToRoute>
 | ReturnType<typeof changeSortType>
 | ReturnType<typeof changeOrderType>
 | ReturnType<typeof updateMinPriceFilter>
 | ReturnType<typeof setMaxPriceFilter>
 | ReturnType<typeof updateGuitarTypeFilter>
 | ReturnType<typeof updateStringsTypeFilter>
 | ReturnType<typeof updateCardsRendered>
 | ReturnType<typeof updateCommentsRendered>;

export type ThunkActionResult<R = Promise<void>> = ThunkAction<R, State, AxiosInstance, Actions>;

export type ThunkAppDispatch = ThunkDispatch<State, AxiosInstance, Actions>;
