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
