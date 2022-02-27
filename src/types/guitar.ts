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

type GuitarsComments = [number, Comment[]];

export type AllGuitarComments = GuitarsComments[];
