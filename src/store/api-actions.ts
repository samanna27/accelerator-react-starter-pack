import { ThunkActionResult } from '../types/action';
import {
  loadGuitars,
  loadGuitarComments,
  updateMinPriceFilter,
  setMaxPriceFilter,
  addComment
} from './action';
import { APIRoute, OK_CODE, OK_CODE_TOP_RANGE } from '../const';
import { Guitar, Comment, CommentPost } from '../types/guitar';
import {toast} from 'react-toastify';

const FAIL_MESSAGE = 'Сервер недоступен';
const COMMENT_POST_FAIL_MESSAGE = 'Ваш комментарий не был отправлен. Попробуйте еще раз.';

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

export const fetchPostReviewAction = (newComment: CommentPost): ThunkActionResult =>
  async (dispatch, _getState, api) => {
    try {
      await api.post<Comment>(APIRoute.Comment, newComment)
        .then((data) => {
          if(data.status >= OK_CODE && data.status <= OK_CODE_TOP_RANGE) {
            dispatch(addComment(data.data));
          }
        });
    } catch {
      toast.info(COMMENT_POST_FAIL_MESSAGE);
    }
  };
