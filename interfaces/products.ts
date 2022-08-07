export type Isize = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';
export type Itype = 'shirts'|'pants'|'hoodies'|'hats';

export interface IProduct {
    _id: string;
    description: string;
    images: string[];
    inStock: number;
    price: number;
    sizes: Isize[];
    slug: string;
    tags: string[];
    title: string;
    type: Itype;
    gender: 'men'|'women'|'kid'|'unisex'
    createdAt: string,
    updatedAt: string
}
