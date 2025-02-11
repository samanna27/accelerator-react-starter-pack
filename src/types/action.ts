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
  updateCommentsRendered,
  addComment,
  addProductToCart,
  deleteProductFromCart,
  applyDiscount,
  UNKNOWN_ACTION
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
  UpdateCommentsRendered = 'data/updateCommentsRendered',
  AddComment = 'data/addComment',
  AddProductToCart = 'data/addProductToCart',
  DeleteProductFromCart = 'data/deleteProductFromCart',
  ApplyDiscount = 'order/applyDiscount',
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
 | ReturnType<typeof updateCommentsRendered>
 | ReturnType<typeof addComment>
 | ReturnType<typeof addProductToCart>
 | ReturnType<typeof deleteProductFromCart>
 | ReturnType<typeof applyDiscount>
 | ReturnType<typeof UNKNOWN_ACTION>;

export type ThunkActionResult<R = Promise<void>> = ThunkAction<R, State, AxiosInstance, Actions>;

export type ThunkAppDispatch = ThunkDispatch<State, AxiosInstance, Actions>;
