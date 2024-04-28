const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running");
});

// connect to mongoDB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nck8v8k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // create database and collection on mongoDB
    const craftsCollection = client.db("crafts").collection("crafts");
    const categoryCollection = client.db("crafts").collection("category");

    // add craft data store in database (Create)
    app.post("/crafts", async (req, res) => {
      const newCraft = req.body;
      const result = await craftsCollection.insertOne(newCraft);
      res.send(result);
    });

    // get all craft data from database(Read)
    app.get("/crafts", async (req, res) => {
      const cursor = craftsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get all category data from database(Read)
    app.get("/category", async (req, res) => {
      const cursor = categoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get a specific craft data from database based on id(Read)
    app.get("/craft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftsCollection.findOne(query);
      res.send(result);
    });

    // get a specific craft data from database based on email(Read)
    app.get("/crafts/:email", async (req, res) => {
      const { email } = req.params;
      const query = { email: email };
      const cursor = craftsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // get a specific craft data from database based on category(Read)
    app.get("/crafts/subcategory/:subcategory_name", async (req, res) => {
      const { subcategory_name } = req.params;
      const query = { subcategory_name: subcategory_name };
      const cursor = craftsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // update a craft
    app.put("/craft/:id", async (req, res) => {
      const id = req.params.id;
      const craft = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCraft = {
        $set: {
          photo: craft.photo,
          item_name: craft.item_name,
          subcategory_name: craft.subcategory_name,
          short_description: craft.short_description,
          price: craft.price,
          rating: craft.rating,
          customization: craft.customization,
          processing_time: craft.processing_time,
          stockStatus: craft.stockStatus,
        },
      };
      const result = await craftsCollection.updateOne(
        filter,
        updateCraft,
        options
      );
      res.send(result);
    });

    // delete a data specific data from database
    app.delete("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftsCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// app listern
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
