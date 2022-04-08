import { ActionType } from '../types/action';
import { Guitar, Comment } from '../types/guitar';
import { AppRoute } from '../const';

export const loadGuitars = (guitars: Guitar[]) => ({
  type: ActionType.LoadGuitars,
  payload: {
    guitars,
  },
} as const);

export const loadGuitarComments = (guitarComments: Comment[], guitarId: number) => ({
  type: ActionType.LoadGuitarComments,
  payload: {
    guitarComments,
    guitarId,
  },
} as const);

export const redirectToRoute = (url: AppRoute) => ({
  type: ActionType.RedirectToRoute,
  payload: url,
} as const);

export const changeSortType = (sortType: string) => ({
  type: ActionType.ChangeSortType,
  payload: sortType,
} as const);

export const changeOrderType = (orderType: string) => ({
  type: ActionType.ChangeOrderType,
  payload: orderType,
} as const);

export const updateMinPriceFilter = (minPriceFilter: number) => ({
  type: ActionType.UpdateMinPriceFilter,
  payload: minPriceFilter,
} as const);

export const setMaxPriceFilter = (maxPriceFilter: number) => ({
  type: ActionType.SetMaxPriceFilter,
  payload: maxPriceFilter,
} as const);

export const updateGuitarTypeFilter = (type: string) => ({
  type: ActionType.UpdateGuitarTypeFilter,
  payload: type,
} as const);

export const updateStringsTypeFilter = (stringsQuantity: number[]) => ({
  type: ActionType.UpdateStringsTypeFilter,
  payload: stringsQuantity,
} as const);

export const updateCardsRendered = (cardsRendered: number[]) => ({
  type: ActionType.UpdateCardsRendered,
  payload: cardsRendered,
} as const);

export const updateCommentsRendered = (commentsRendered: number) => ({
  type: ActionType.UpdateCommentsRendered,
  payload: commentsRendered,
} as const);

export const addComment = (newComment: Comment) => ({
  type: ActionType.AddComment,
  payload: newComment,
} as const);

export const UNKNOWN_ACTION = () => ({
  type: UNKNOWN_ACTION,
} as const);
