import { ThunkActionResult } from '../types/action';
import {
  loadGuitars,
  loadGuitarComments,
  updateMinPriceFilter,
  setMaxPriceFilter
} from './action';
import { APIRoute, OK_CODE } from '../const';
import { Guitar, Comment } from '../types/guitar';

export const fetchProductsAction = (): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    const {data} = await api.get<Guitar[]>(APIRoute.Guitars);
    dispatch(loadGuitars(data));
    const minPriceFilter = Math.min(...data.map((item) => item.price));
    const maxPriceFilter = Math.max(...data.map((item) => item.price)) ;
    dispatch(updateMinPriceFilter(minPriceFilter));
    dispatch(setMaxPriceFilter(maxPriceFilter));
  };

export const fetchCommentsDataAction = (id: number): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    await api.get<Comment[]>(`/guitars/${id}/comments`)
      .then((data) => {
        if(data.status === OK_CODE){
          dispatch(loadGuitarComments(data.data, id));
        }
      });
  };
