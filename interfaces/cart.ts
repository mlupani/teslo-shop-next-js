import { Isize } from './products'

export interface IProductCart {
    _id: string;
    image: string;
    price: number;
    size?: Isize;
    slug: string;
    title: string;
    gender: 'men'|'women'|'kid'|'unisex'
    quantity: number;
}
