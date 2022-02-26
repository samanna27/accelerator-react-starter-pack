import { ThunkActionResult } from '../types/action';
import {
  loadGuitars,
  loadGuitarComments
} from './action';
import { APIRoute, OK_CODE } from '../const';
import { Guitar, Comment } from '../types/guitar';

export const fetchProductsAction = (): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    const {data} = await api.get<Guitar[]>(APIRoute.Guitars);
    dispatch(loadGuitars(data));
  };

export const fetchCommentsDataAction = (id: number): ThunkActionResult =>
// export const fetchCommentsDataAction = (id: number, currezntId: number ): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    await api.get<Comment[]>(`/guitars/${id}/comments`)
      .then((data) => {
        if(data.status === OK_CODE){
          dispatch(loadGuitarComments(data.data));
          // dispatch(loadGuitarComments(data.data, currentId));
          return data.data;
        }
      });
  };
