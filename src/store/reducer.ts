import { Actions, ActionType } from '../types/action';
import { State } from '../types/state';

const initialState = {
  guitars: [],
  allGuitarsComments: [],
  currentId: 0,
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
    default:
      return state;
  }
};

export {reducer};
