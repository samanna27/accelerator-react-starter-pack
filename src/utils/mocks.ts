import { name, internet, date } from 'faker';
import { nanoid } from 'nanoid';
import { Guitar, Comment, CommentPost } from '../types/guitar';

export const makeFakeGuitars = (): Guitar[] => ([{
  id: 1,
  name: name.title(),
  vendorCode: nanoid(),
  type: 'acoustic',
  description: 'very,very good',
  previewImg: internet.avatar(),
  stringCount: 4,
  rating: 3,
  price: 12000,
},
{
  id: 2,
  name: name.title(),
  vendorCode: nanoid(),
  type: 'ukulele',
  description: 'nice and cool',
  previewImg: internet.avatar(),
  stringCount: 4,
  rating: 5,
  price: 4500,
}] as Guitar[]);

export const FakeMinPrice = 4500;
export const FakeMaxPrice = 12000;

export const makeFakeComments = (guitarId: number): Comment[] => ([{
  id: 1,
  userName: 'Anya',
  advantage: 'bad',
  disadvantage: 'very bad',
  comment: 'so-so-so-so',
  rating: 5,
  createAt: date.recent().toString(),
  guitarId: guitarId,
},
{
  id: 2,
  userName: 'Ziya',
  advantage: 'good',
  disadvantage: 'very good',
  comment: 'i glad that i found that guitar',
  rating: 5,
  createAt: date.past().toString(),
  guitarId: guitarId,
}] as Comment[]);

export const makeFakeCommentToPost = (guitarId: number): CommentPost => ({
  userName: 'Boris',
  advantage: 'prum',
  disadvantage: 'vrum',
  comment: 'vrim',
  rating: 3,
  guitarId: guitarId,
});

export const makeFakeCommentToAdd = (guitarId: number, commentId: number): Comment => ({
  id: commentId,
  userName: 'Boris',
  advantage: 'prum',
  disadvantage: 'vrum',
  comment: 'vrim',
  rating: 3,
  createAt: date.recent().toString(),
  guitarId: guitarId,
});

export const makeFakeGuitar = (guitarId: number): Guitar => ({
  id: guitarId,
  name: name.title(),
  vendorCode: nanoid(),
  type: 'acoustic',
  description: 'very,very good',
  previewImg: internet.avatar(),
  stringCount: 4,
  rating: 3,
  price: 12000,
});
