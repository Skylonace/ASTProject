import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";

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

shoeRouter.get("/:id", async (req, res) => {
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
        const shoe = req.body;
        console.log(shoe);
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

shoeRouter.delete("/:id", async (req, res) => {
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