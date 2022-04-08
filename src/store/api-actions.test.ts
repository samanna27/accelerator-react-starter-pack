import MockAdapter from 'axios-mock-adapter';
import { createAPI } from '../services/api';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { State } from '../types/state';
import { Action } from 'redux';
import { makeFakeGuitars, FakeMinPrice, FakeMaxPrice, makeFakeComments, makeFakeCommentToPost } from '../utils/mocks';
import { APIRoute } from '../const';
import { Guitar, Comment, CommentPost } from '../types/guitar';
import { loadGuitars, updateMinPriceFilter, setMaxPriceFilter, loadGuitarComments, addComment } from './action';
import { fetchProductsAction, fetchCommentsDataAction, fetchPostReviewAction } from './api-actions';
import { date } from 'faker';

describe('Async actions', () => {
  const api = createAPI();
  const mockAPI = new MockAdapter(api);
  const middlewares = [thunk.withExtraArgument(api)];

  const mockStore = configureMockStore<
    State,
    Action,
    ThunkDispatch<State, typeof api, Action>
  >(middlewares);

  it('should dispatch Load_Guitars, Update_Min_Price_Filter, Set_Max_Price_Filter when GET /guitars', async () => {
    const fakeGuitars: Guitar[] = makeFakeGuitars();
    mockAPI
      .onGet(APIRoute.Guitars)
      .reply(200, fakeGuitars);

    const store = mockStore();
    await store.dispatch(fetchProductsAction());

    expect(store.getActions()).toEqual([
      loadGuitars(fakeGuitars),
      updateMinPriceFilter(FakeMinPrice),
      setMaxPriceFilter(FakeMaxPrice),
    ]);
  });


  it('should dispatch Load_Guitar_Comments when GET /guitars/:id/comments', async () => {
    const guitarId = 12;
    const fakeComments: Comment[] = makeFakeComments(guitarId);
    mockAPI
      .onGet(`guitars/${guitarId}/comments`)
      .reply(200, fakeComments);

    const store = mockStore();
    await store.dispatch(fetchCommentsDataAction(guitarId));

    expect(store.getActions()).toEqual([
      loadGuitarComments(fakeComments, guitarId),
    ]);
  });

  it('should dispatch AddComment when POST /comments', async () => {
    const guitarWithNewComment = 28;
    const fakeCommentToPost: CommentPost = makeFakeCommentToPost(guitarWithNewComment);
    mockAPI
      .onPost(APIRoute.Comment)
      .reply(201, {...fakeCommentToPost, createAt: date.recent(), id: 1});

    const store = mockStore();
    await store.dispatch(fetchPostReviewAction(fakeCommentToPost));

    expect(store.getActions()).toEqual([
      addComment({...fakeCommentToPost, createAt: date.recent(), id: 1}),
    ]);
  });
});
