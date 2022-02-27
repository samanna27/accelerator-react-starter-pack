import { Guitar, AllGuitarComments } from './guitar';

export type State = {
  guitars: Guitar[],
  allGuitarsComments: AllGuitarComments,
  currentId: number,
};
