import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";
import { Shoe, parse_shoe} from "./shoe";

export const shoeRouter = express.Router();
shoeRouter.use(express.json());

shoeRouter.get("/", async (_req, res) => {
    try {
        const shoes = await collections?.shoes?.find({}).toArray();
        res.status(200).send(shoes);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});

shoeRouter.get("/id/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const shoe = await collections?.shoes?.findOne(query);

        if (shoe) {
            res.status(200).send(shoe);
        } else {
            res.status(404).send(`Failed to find shoe: ID ${id}`);
        }
    } catch (error) {
        res.status(404).send(`Failed to find shoe: ID ${req?.params?.id}`);
    }
});

shoeRouter.post("/", async (req, res) => {
    try {
        const shoe = parse_shoe(req?.body);
        if(!shoe) {
            res.status(400).send("Invalid shoe data.");
            return;
        }
        const result = await collections?.shoes?.insertOne(shoe);

        if (result?.acknowledged) {
            res.status(201).send(`Created a new shoe: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new shoe.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});

shoeRouter.put("/id/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const shoe = parse_shoe(req?.body);
        if(!shoe) {
            res.status(400).send("Invalid shoe data.");
            return;
        }
        const query = { _id: new ObjectId(id) };
        const result = await collections?.shoes?.updateOne(query, { $set: shoe });

        if (result && result.matchedCount) {
            res.status(200).send(`Updated a shoe: ID ${id}.`);
        } else if (!result?.matchedCount) {
            res.status(404).send(`Failed to find a shie: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update a shoe: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});

shoeRouter.delete("/id/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const result = await collections?.shoes?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed an shoe: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove an shoe: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find an shoe: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});

shoeRouter.get("/search", async (req, res) => {
    try {
        if(!req?.query?.filterBy || !req?.query?.filter) {
            res.status(400).send("Invalid search query.");
            return;
        }
        var filter;
        if(req?.query?.filterBy === "stock") {
            
            filter = parseInt(req?.query?.filter.toString());
        }
        else {
            filter = req?.query?.filter.toString();
        }
        const filterBy = req?.query?.filterBy;
        const query = { [filterBy.toString()]: filter };
        const shoes = await collections?.shoes?.find(query).toArray();
        if (shoes) {
            res.status(200).send(shoes);
        } else {
            res.status(404).send(`Failed to find shoes: ${filterBy} ${filter}`);
        }
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});