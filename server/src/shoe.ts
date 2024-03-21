import * as mongodb from 'mongodb';
import { shoeRouter } from './shoe.routes';

export interface Shoe {
    _id?: mongodb.ObjectId;
    name: string;
    price: number;
    size: string;
    color: string;
    brand: string;
    stock: number;
}

export function parse_shoe(body: any): Shoe | null{
    const regex= new RegExp('^[0-9]+(\\.[0-9]{1,2})?');

    if(!regex.test(body?.price.toString())) {
        return null;
    }

    var price = 0;
    const pricePices = body?.price.toString().split('.');
    price = parseInt(pricePices[0]) * 100;
    if(pricePices.length > 1) {
        price += parseInt(pricePices[1]) * 10 ** (2 - pricePices[1].length);
    }

    const stock = parseInt(body?.stock);
    if (isNaN(stock)) {
        return null;
    }
    const shoe: Shoe = {
        name: body?.name,
        price: price,
        size: body?.size,
        color: body?.color,
        brand: body?.brand,
        stock: stock
    };

    return shoe;
}