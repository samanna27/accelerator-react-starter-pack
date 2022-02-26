import { Actions, ActionType } from '../types/action';
import { State } from '../types/state';

const initialState = {
  guitars: [],
  guitarComments: null,
  currentId: 0,
};

const reducer = (state: State = initialState, action: Actions): State => {
  switch (action.type) {
    case ActionType.LoadGuitars: {
      const {guitars} = action.payload;
      return {...state, guitars};
    }
    case ActionType.LoadGuitarComments: {
      const guitarComments = action.payload.guitarComments;
      // const currentId = action.payload.currentId;
      return {...state, guitarComments};
      // return {...state, guitarComments, currentId};
    }
    default:
      return state;
  }
};

export {reducer};
