import * as mongodb from 'mongodb';

export interface Shoe {
    _id?: mongodb.ObjectId;
    name: string;
    price: number;
    stock: number;
}