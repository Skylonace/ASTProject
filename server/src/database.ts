import * as mongodb from 'mongodb';
import { Shoe } from './shoe';

export const collections: {
    shoes?: mongodb.Collection<Shoe>;
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("shoeStore");
    await applySchemaValidation(db);

    const shoesCollection = db.collection<Shoe>("shoes");
    collections.shoes = shoesCollection;
}

async function applySchemaValidation(db: mongodb.Db) {
    const jsonSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "prize", "stock"],
            additionalProperties: false,
            properties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description: "'name' is required and is a string",
                },
                price: {
                    bsonType: "int",
                    description: "'price' is required and is a integer (cents)",
                },
                size: {
                    bsonType: "int",
                    description: "'size' is optional and is a integer",
                },
                color: {
                    bsonType: "string",
                    description: "'color' is optional and is a string",
                },
                brand: {
                    bsonType: "string",
                    description: "'brand' is optional and is a string",
                },
                stock: {
                    bsonType: "int",
                    description: "'stock' is required and is a integer",
                },
            },
        },
    };

    // Try applying the modification to the collection, if the collection doesn't exist, create it
   await db.command({
        collMod: "shoes",
        validator: jsonSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === "NamespaceNotFound") {
            await db.createCollection("shoes", {validator: jsonSchema});
        }
    });
}