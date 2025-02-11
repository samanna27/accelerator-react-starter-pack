import { GuitarType, StringsByGuitarType } from './types/guitar';

export enum AppRoute {
  Catalog = '/',
  Guitar = '/guitars/:id',
  Cart = '/cart',
}

export enum APIRoute {
  Guitars = '/guitars',
  Comment = '/comments',
  Coupon = '/coupons',
}

export const MAX_STAR_RATING = 5;
export const FULL_STAR = 1;
export const OK_CODE = 200;
export const OK_CODE_TOP_RANGE = 299;

export const SORT_TYPES = ['по цене','по популярности'];

export const SORT_ORDERS = ['up', 'down'];

export const GUITAR_TYPE: GuitarType = {
  'acoustic': 'Акустические гитары',
  'electric': 'Электрогитары',
  'ukulele': 'Укулеле',
};

export const GUITAR_TYPE_SINGLE: GuitarType = {
  'acoustic': 'Акустическая гитара',
  'electric': 'Электрогитара',
  'ukulele': 'Укулеле',
};

export const STRINGS_QUANTITY_BY_GUITAR: StringsByGuitarType = {
  'acoustic': [6,7,12],
  'electric': [4,6,7],
  'ukulele': [4],
};

export const GUITAR_STRINGS = [4,6,7,12];

export const GUITARS_TYPES_CHECKED = {
  'acoustic': false,
  'electric': false,
  'ukulele': false,
};

export const PAGENATION = [1, 2, 3];

export const CARDS_PER_PAGE = 9;

export const START_CARD_INDEX = 0;

export const END_CARD_INDEX = 1;

export const GUITAR_TYPE_CHECKED_FLAG = 1;

export const GUITAR_TYPE_CHECKED_INDEX = 0;

export const DEFAULT_PAGES = 3;

export const CHARACTERISTICS = ['Характеристики','Описание'];

export const COMMENTS_SHOW_PER_CLICK = 3;

export const KEYCODE_TAB = 9;
