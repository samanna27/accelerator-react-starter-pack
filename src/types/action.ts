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
  loadGuitarComments
} from '../store/action';

export enum ActionType {
  LoadGuitars = 'data/loadGuitars',
  LoadGuitarComments = 'data/loadGuitarComments'
}

export type Actions =
 | ReturnType<typeof loadGuitars>
 | ReturnType<typeof loadGuitarComments>;

export type ThunkActionResult<R = Promise<void>> = ThunkAction<R, State, AxiosInstance, Actions>;

export type ThunkAppDispatch = ThunkDispatch<State, AxiosInstance, Actions>;
