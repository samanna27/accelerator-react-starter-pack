import { Actions, ActionType } from '../types/action';
import { State } from '../types/state';

const initialState = {
  guitars: [],
  allGuitarsComments: [],
  currentId: 0,
  sortType: '',
  orderType: '',
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
    default:
      return state;
  }
};

export {reducer};
