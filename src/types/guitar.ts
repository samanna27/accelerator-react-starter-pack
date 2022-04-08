export type Guitar = {
  id: number;
  name: string;
  vendorCode: string;
  type: string;
  description: string;
  previewImg: string;
  stringCount: number;
  rating: number;
  price: number;
};

export type Comment = {
  id: number;
  userName: string;
  advantage: string;
  disadvantage: string;
  comment: string;
  rating: number;
  createAt: Date;
  guitarId: number;
};

export type CommentPost = {
  userName: string;
  advantage: string;
  disadvantage: string;
  comment: string;
  rating: number;
  guitarId: number;
};

type GuitarsComments = [number, Comment[]];

export type AllGuitarComments = GuitarsComments[];

export type GuitarType = {[key: string]: string};

export type StringsByGuitarType = {[key: string]: number[]};

export type GuitarTypeChecked = {[key: string]: boolean};

export type StringsChecked = {[key: number]: boolean};
