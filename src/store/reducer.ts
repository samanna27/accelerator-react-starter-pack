import { CARDS_PER_PAGE, GUITARS_TYPES_CHECKED } from '../const';
import { Actions, ActionType } from '../types/action';
import { State } from '../types/state';
import { GuitarTypeChecked } from '../types/guitar';

const initialState = {
  guitars: [],
  allGuitarsComments: [],
  currentId: 0,
  sortType: '',
  orderType: '',
  minPriceFilter: 0,
  maxPriceFilter: 0,
  guitarType: GUITARS_TYPES_CHECKED,
  stringsQuantity: [],
  cardsRendered: [0, CARDS_PER_PAGE],
};

const reducer = (state: State = initialState, action: Actions): State => {
  switch (action.type) {
    case ActionType.LoadGuitars: {
      const {guitars} = action.payload;
      return {...state, guitars};
    }
    case ActionType.LoadGuitarComments: {
      const allGuitarsComments = state.allGuitarsComments.slice();
      const id = action.payload.guitarId;
      allGuitarsComments.push([id, action.payload.guitarComments]);
      return {...state, allGuitarsComments};
    }
    case ActionType.ChangeSortType: {
      const sortType = action.payload;
      return {...state, sortType};
    }
    case ActionType.ChangeOrderType: {
      const orderType = action.payload;
      return {...state, orderType};
    }
    case ActionType.UpdateMinPriceFilter: {
      const minPriceFilter = action.payload;
      return {...state, minPriceFilter};
    }
    case ActionType.SetMaxPriceFilter: {
      const maxPriceFilter = action.payload;
      return {...state, maxPriceFilter};
    }
    case ActionType.UpdateGuitarTypeFilter: {
      const type = action.payload;
      const guitarType: GuitarTypeChecked = {};
      Object.assign(guitarType, state.guitarType);
      guitarType[type] = !guitarType[type];
      return {...state, guitarType};
    }
    case ActionType.UpdateStringsTypeFilter: {
      const stringsQuantity = action.payload;
      return {...state, stringsQuantity};
    }
    case ActionType.UpdateCardsRendered: {
      const cardsRendered = action.payload;
      return {...state, cardsRendered};
    }
    default:
      return state;
  }
};

export {reducer};
