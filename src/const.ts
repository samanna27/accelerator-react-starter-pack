import { GuitarType, StringsByGuitarType } from './types/guitar';

export enum AppRoute {
  Catalog = '/',
  Guitar = '/guitars/:id',
}

export enum APIRoute {
  Guitars = '/guitars',
}

export const MAX_STAR_RATING = 5;
export const FULL_STAR = 1;
export const OK_CODE = 200;

export const SORT_TYPES = ['по цене','по популярности'];

export const SORT_ORDERS = ['up', 'down'];

export const GUITAR_TYPE: GuitarType = {
  'acoustic': 'Акустические гитары',
  'electric': 'Электрогитары',
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

export const CARDS_PER_PAGE = 6;

export const START_CARD_INDEX = 0;

export const END_CARD_INDEX = 1;
