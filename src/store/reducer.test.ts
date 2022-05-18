import {
  loadGuitarComments,
  loadGuitars,
  changeSortType,
  changeOrderType,
  updateMinPriceFilter,
  setMaxPriceFilter,
  updateGuitarTypeFilter,
  updateStringsTypeFilter,
  updateCardsRendered,
  updateCommentsRendered,
  addComment,
  addProductToCart,
  deleteProductFromCart,
  applyDiscount
} from './action';
import { reducer, initialState } from './reducer';
import { Guitar, Comment, AllGuitarComments } from '../types/guitar';
import { makeFakeGuitars, makeFakeComments, makeFakeCommentToAdd, makeFakeGuitar} from '../utils/mocks';
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

  it ('should update sortType', () => {
    const state = {...initialState};
    const fakeSortType = 'по цене';
    expect(reducer(state, changeSortType(fakeSortType)))
      .toEqual({...initialState, sortType: fakeSortType});
  });

  it ('should update orderType', () => {
    const state = {...initialState};
    const fakeOrderType = 'up';
    expect(reducer(state, changeOrderType(fakeOrderType)))
      .toEqual({...initialState, orderType: fakeOrderType});
  });

  it ('should update minPriceFilter', () => {
    const state = {...initialState};
    const fakeMinPriceFilter = 2500;
    expect(reducer(state, updateMinPriceFilter(fakeMinPriceFilter)))
      .toEqual({...initialState, minPriceFilter: fakeMinPriceFilter});
  });

  it ('should set maxPriceFilter', () => {
    const state = {...initialState};
    const fakeMaxPriceFilter = 25123;
    expect(reducer(state, setMaxPriceFilter(fakeMaxPriceFilter)))
      .toEqual({...initialState, maxPriceFilter: fakeMaxPriceFilter});
  });

  it ('should update guitarTypeFilter', () => {
    const state = {...initialState};
    const fakeTypeChecked = 'ukulele';
    const fakeGuitarType = {
      'acoustic': false,
      'electric': false,
      'ukulele': true,
    };
    expect(reducer(state, updateGuitarTypeFilter(fakeTypeChecked)))
      .toEqual({...initialState, guitarType: fakeGuitarType});
  });

  it ('should update strings type filter, strings quantity set', () => {
    const state = {...initialState};
    const fakeStrings = [19, 99, 999];
    expect(reducer(state, updateStringsTypeFilter(fakeStrings)))
      .toEqual({...initialState, stringsQuantity: fakeStrings});
  });

  it ('should update cards rendered', () => {
    const state = {...initialState};
    const fakeCardsRendered = [19, 999];
    expect(reducer(state, updateCardsRendered(fakeCardsRendered)))
      .toEqual({...initialState, cardsRendered: fakeCardsRendered});
  });

  it ('should update quantity of comments rendered', () => {
    const state = {...initialState};
    const fakeQuantity = 104;
    expect(reducer(state, updateCommentsRendered(fakeQuantity)))
      .toEqual({...initialState, commentsRendered: fakeQuantity});
  });

  it ('should add new comment to comments array for the required guitar', () => {
    const fakeGuitarIdOne = 40;
    const fakeGuitarIdTwo = 41;
    const fakeGuitarCommentsGuitarOne: Comment[] = makeFakeComments(fakeGuitarIdOne);
    const fakeGuitarCommentsGuitarTwo: Comment[] = makeFakeComments(fakeGuitarIdTwo);
    const fakeAllGuitarsComments: AllGuitarComments = [
      [fakeGuitarIdOne, fakeGuitarCommentsGuitarOne],
      [fakeGuitarIdTwo, fakeGuitarCommentsGuitarTwo],
    ];
    const state = {...initialState, allGuitarsComments: fakeAllGuitarsComments};
    const fakeComment = makeFakeCommentToAdd(fakeGuitarIdOne, fakeGuitarCommentsGuitarOne.length);
    const updatedFakeGuitarCommentsGuitarOne: Comment[] = [...fakeGuitarCommentsGuitarOne, fakeComment];
    const updatedFakeAllGuitarsComments: AllGuitarComments = [
      [fakeGuitarIdOne, updatedFakeGuitarCommentsGuitarOne],
      [fakeGuitarIdTwo, fakeGuitarCommentsGuitarTwo],
    ];
    expect(reducer(state, addComment(fakeComment)))
      .toEqual({...initialState, allGuitarsComments: updatedFakeAllGuitarsComments});
  });

  it('should add selected guitart to cart', () => {
    const state = {...initialState};
    const fakeGuitarId = 39;
    const fakeGuitar = makeFakeGuitar(fakeGuitarId);
    const fakeQuantity = 4;
    const fakeProductsInCart = [fakeGuitar];
    const fakeProductsQuantityInCart = [fakeGuitarId, fakeQuantity];
    expect(reducer(state, addProductToCart(fakeGuitar, fakeQuantity)))
      .toEqual({...initialState, productsInCart: fakeProductsInCart, productsQuantityInCart: fakeProductsQuantityInCart});
  });

  it('should delete selected guitart from cart', () => {
    const fakeProductsInCart = makeFakeGuitars();
    const fakeProductToDelete = fakeProductsInCart.splice(0,1)[0];
    const guitarOneId = 1;
    const guitarOneQuantity = 3;
    const guitarTwoId = 2;
    const guitarTwoQuantity = 2;
    const fakeProductsQuantityInCart = [[guitarOneId, guitarOneQuantity],[guitarTwoId, guitarTwoQuantity]];
    const state = {...initialState, productsInCart: fakeProductsInCart, productsQuantityInCart: fakeProductsQuantityInCart};
    const fakeProductsInCartAfterDeletion = fakeProductsInCart.slice(1);
    const fakeProductsQuantityInCartAfterDeletion = [[guitarTwoId, guitarTwoQuantity]];
    expect(reducer(state, deleteProductFromCart(fakeProductToDelete)))
      .toEqual({...initialState, productsInCart: fakeProductsInCartAfterDeletion, productsQuantityInCart: fakeProductsQuantityInCartAfterDeletion});
  });

  it('should update coupon value', () => {
    const state = {...initialState};
    const fakeDiscount = '15';
    const fakeCouponValue = 15;
    expect(reducer(state, applyDiscount(fakeDiscount)))
      .toEqual({...initialState, couponValue: fakeCouponValue});
  });

});
