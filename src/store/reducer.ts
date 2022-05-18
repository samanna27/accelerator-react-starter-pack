import { CARDS_PER_PAGE, GUITARS_TYPES_CHECKED } from '../const';
import { Actions, ActionType } from '../types/action';
import { State } from '../types/state';
import { GuitarTypeChecked } from '../types/guitar';

export const initialState = {
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
  isDataLoaded: false,
  commentsRendered: 3,
  productsInCart: [],
  productsQuantityInCart: [],
  couponValue: 0,
};

const reducer = (state: State = initialState, action: Actions): State => {
  switch (action.type) {
    case ActionType.LoadGuitars: {
      const {guitars} = action.payload;
      return {...state, guitars, isDataLoaded: true};
    }
    case ActionType.LoadGuitarComments: {
      const allGuitarsComments = state.allGuitarsComments.slice();
      const id = action.payload.guitarId;
      if(allGuitarsComments.map((item) => item[0]).includes(id)){
        const elementToReplace = allGuitarsComments.findIndex((element) => element[0] === id);
        allGuitarsComments[elementToReplace][1] = action.payload.guitarComments;
      } else {
        allGuitarsComments.push([id, action.payload.guitarComments]);
      }
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
    case ActionType.UpdateCommentsRendered: {
      const commentsRendered = action.payload;
      return {...state, commentsRendered};
    }
    case ActionType.AddComment: {
      const allGuitarsComments = state.allGuitarsComments.slice();
      const id = action.payload.guitarId;
      if(allGuitarsComments.map((item) => item[0]).includes(id)){
        const elementToAddNewComment = allGuitarsComments.findIndex((element) => element[0] === id);
        allGuitarsComments[elementToAddNewComment][1].push(action.payload);
      } else {
        const comments = new Array(action.payload);
        allGuitarsComments.push([id, comments]);
      }
      return {...state, allGuitarsComments};
    }
    case ActionType.AddProductToCart: {
      const product = action.payload.product;
      const productQuantity = action.payload.quantity;
      const productsInCart = state.productsInCart.slice();
      const productsQuantityInCart = state.productsQuantityInCart.slice();
      const ID_INDEX = 0;
      const QUANTITY_INDEX = 1;
      const searchedItem = productsQuantityInCart.filter((item) => item[ID_INDEX] === product.id);
      if(searchedItem.length === 0) {
        productsQuantityInCart.push([product.id, productQuantity]);
        productsInCart.push(product);
      } else {
        productsQuantityInCart.filter((item) => item[ID_INDEX] === product.id)[0][QUANTITY_INDEX] = productQuantity;
      }
      return {...state, productsInCart, productsQuantityInCart};
    }
    case ActionType.DeleteProductFromCart: {
      const productToDelete = action.payload;
      const productsInCart = state.productsInCart.slice();
      const productsQuantityInCart = state.productsQuantityInCart.slice();
      const productToDeleteIndex = productsInCart.map((item) => item.id).indexOf(productToDelete.id);
      const quantityToDeleteIndex = productsQuantityInCart.map((item) => item[0]).indexOf(productToDelete.id);
      productsInCart.splice(productToDeleteIndex, 1);
      productsQuantityInCart.splice(quantityToDeleteIndex, 1);
      return {...state, productsInCart, productsQuantityInCart};
    }
    case ActionType.ApplyDiscount: {
      let couponValue: number | null = 0;
      if (typeof(action.payload) === 'object') {
        couponValue = null;
      } else {
        couponValue = Number(action.payload);
      }
      return {...state, couponValue};
    }
    default:
      return state;
  }
};

export {reducer};
