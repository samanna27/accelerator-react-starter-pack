import { Guitar, AllGuitarComments, GuitarTypeChecked } from './guitar';

export type State = {
  guitars: Guitar[],
  allGuitarsComments: AllGuitarComments,
  currentId: number,
  sortType: string,
  orderType: string,
  minPriceFilter: number,
  maxPriceFilter: number,
  guitarType: GuitarTypeChecked,
  stringsQuantity: number[],
  cardsRendered: number[],
  isDataLoaded: boolean,
  commentsRendered: number,
};
