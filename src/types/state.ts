import { Guitar, Comment } from './guitar';

export type State = {
  guitars: Guitar[],
  guitarComments: Comment[] | null,
  currentId: number,
};
