import MockAdapter from 'axios-mock-adapter';
import { createAPI } from '../services/api';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { State } from '../types/state';
import { Action } from 'redux';
import { makeFakeGuitars, FakeMinPrice, FakeMaxPrice, makeFakeComments, makeFakeCommentToPost } from '../utils/mocks';
import { APIRoute } from '../const';
import { Guitar, CommentPost } from '../types/guitar';
import { loadGuitars, updateMinPriceFilter, setMaxPriceFilter, loadGuitarComments, addComment, applyDiscount } from './action';
import { fetchProductsAction, fetchCommentsDataAction, fetchPostReviewAction, fetchCouponPostAction } from './api-actions';
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
    const fakeComments = makeFakeComments(guitarId);
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
    const dateOfCommentCreation = date.recent().toString();
    mockAPI
      .onPost(APIRoute.Comment)
      .reply(201, {...fakeCommentToPost, createAt: dateOfCommentCreation, id: 1});

    const store = mockStore();
    await store.dispatch(fetchPostReviewAction(fakeCommentToPost));

    expect(store.getActions()).toEqual([
      addComment({...fakeCommentToPost, createAt: dateOfCommentCreation, id: 1}),
    ]);
  });

  it('should dispatch ApplyDiscount with discount rate when POST /coupons with correct code', async () => {
    const fakeCorrectCoupon = {coupon: 'light-333'};
    const fakeDiscount = '15';
    mockAPI
      .onPost(APIRoute.Coupon)
      .reply(200, {coupon: fakeDiscount});

    const store = mockStore();
    await store.dispatch(fetchCouponPostAction(fakeCorrectCoupon));

    expect(store.getActions()).toEqual([
      applyDiscount({coupon: fakeDiscount}),
    ]);
  });

  it('should dispatch ApplyDiscount with null coupon when POST /coupons with incorrect code', async () => {
    const fakeCorrectCoupon = {coupon: 'bla-bla'};
    const fakeDiscount = null;
    mockAPI
      .onPost(APIRoute.Coupon)
      .reply(400);

    const store = mockStore();
    await store.dispatch(fetchCouponPostAction(fakeCorrectCoupon));

    expect(store.getActions()).toEqual([
      applyDiscount({coupon: fakeDiscount}),
    ]);
  });
});
