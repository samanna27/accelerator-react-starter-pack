import { ActionType } from '../types/action';
import { Guitar, Comment } from '../types/guitar';

export const loadGuitars = (guitars: Guitar[]) => ({
  type: ActionType.LoadGuitars,
  payload: {
    guitars,
  },
} as const);

export const loadGuitarComments = (guitarComments: Comment[]) => ({
// export const loadGuitarComments = (guitarComments: Comment[], currentId: number | null) => ({
  type: ActionType.LoadGuitarComments,
  payload: {
    guitarComments,
    // guitarComments, currentId,
  },
} as const);
