import { ThunkActionResult } from '../types/action';
import {
  loadGuitars,
  loadGuitarComments,
  updateMinPriceFilter,
  setMaxPriceFilter
} from './action';
import { APIRoute, OK_CODE } from '../const';
import { Guitar, Comment } from '../types/guitar';
import {toast} from 'react-toastify';

const FAIL_MESSAGE = 'Сервер недоступен';

export const fetchProductsAction = (): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    try {
      await api.get<Guitar[]>(APIRoute.Guitars)
        .then((data) => {
          if(data.status === OK_CODE) {
            dispatch(loadGuitars(data.data));
            const minPriceFilter = Math.min(...data.data.map((item) => item.price));
            const maxPriceFilter = Math.max(...data.data.map((item) => item.price)) ;
            dispatch(updateMinPriceFilter(minPriceFilter));
            dispatch(setMaxPriceFilter(maxPriceFilter));
          }
        });
    } catch {
      toast.info(FAIL_MESSAGE);
    }
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

// export const fetchSelectedGuitarDataAction = (pathname: string): ThunkActionResult =>
//   async (dispatch, _getState, api): Promise<void> => {
//     await api.get<Guitar>(pathname)
//       .then((data) => {
//         if(data.status === OK_CODE){
//           dispatch(loadGuitar(data.data));
//         }
//       });
//   };
