import { loadGuitarComments, loadGuitars } from './action';
import { reducer, initialState } from './reducer';
import { Guitar, Comment } from '../types/guitar';
import { makeFakeGuitars, makeFakeComments } from '../utils/mocks';
import { UNKNOWN_ACTION } from '../store/action';

describe('reducer: reducer', () => {
  it('without additional parameters should return initial state', () => {
    expect(reducer(initialState, {type: UNKNOWN_ACTION}))
      .toEqual(initialState);
  });

  it('should update array of guitars objects and update status of data loaded', () => {
    const state = {...initialState, guitars: [], isDataLoaded: false};
    const fakeGuitars: Guitar[] = makeFakeGuitars();
    expect(reducer(state, loadGuitars(fakeGuitars)))
      .toEqual({...initialState, guitars: fakeGuitars, isDataLoaded: true});
  });

  it ('should update array of guitar comments', () => {
    const state = {...initialState, allGuitarsComments: []};
    const fakeGuitarId = 40;
    const fakeGuitarComments: Comment[] = makeFakeComments(fakeGuitarId);
    expect(reducer(state, loadGuitarComments(fakeGuitarComments, fakeGuitarId)))
      .toEqual({...initialState, allGuitarsComments:[[fakeGuitarId, fakeGuitarComments]]});
  });

});
