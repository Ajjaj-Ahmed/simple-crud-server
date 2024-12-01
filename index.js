const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(express.json())
app.use(cors())


const uri = "mongodb+srv://ajjaj1412:L0Czkl7On5vnvrg8@cluster0.zrru5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const database = client.db("usersDB");
        const userCollection = database.collection("users");

        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // load single user by id
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            // from mongo
            const query = { _id: new ObjectId(id) };
            const user = await userCollection.findOne(query);
            res.send(user)
        })

        // save data to database. use async because of await use inside
        app.post('/users', async (req, res) => {
            const user = req.body;
            // send data to server
            console.log('New users,:', user)
            // send data to database
            const result = await userCollection.insertOne(user);
            res.send(result)

        })
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            console.log("user for update:", id, user)
            // for mongodb
            const filter = { _id: new ObjectId(id)};
            const options = { upsert: true };
            const updateUser = {
                $set: {
                  name:user.name,
                  email:user.email
                },
              };
              const result = await userCollection.updateOne(filter, updateUser, options);
              res.send(result)
        })
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log('please delete this id', id);

            // delete from database
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.log());





app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})