const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
app.use(cors())
app.use(express.json());


const uri = "mongodb+srv://taskyAdmin:T80qOGhCO2ZoZTvU@cluster0.em2vhup.mongodb.net/?retryWrites=true&w=majority";

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

    const userCollection = client.db("tasky").collection("users");
    const taskCollection = client.db("tasky").collection("tasks");


    // users related api
    app.get('/users', async(req, res) => {
        const result = await userCollection.find().toArray();
        res.send(result)
    })
    app.get('/users/:email', async(req, res) => {
        const userEmail = req.params.email;
        const query = {email: userEmail}
        const result = await userCollection.findOne(query);
        res.send(result)
    })
    app.post('/users', async(req, res) => {
        const user = req.body;
        const result = await userCollection.insertOne(user);
        res.send(result);
    })

    // task related api
    app.get('/tasks/:email', async(req, res) => {
        const userEmail = req.params.email;
        const query = { email: userEmail};
        const result = await taskCollection.find(query).toArray();
        res.send(result)
    })
    app.post('/tasks', async(req, res) => {
        const task = req.body;
        const result = await taskCollection.insertOne(task);
        res.send(result);
    })
    // app.delete('/tasks/:id', async(req, res) => {
    //     const id = req.params.id;
    //     const filter = { _id: new ObjectId(id)};
    //     const result = await taskCollection.deleteOne(filter);
    //     res.send(result);
    // })

    // app.patch('/task/update/:id', async(req, res) => {
    //     const id = req.params.id;
    //     const filter = { _id: new ObjectId(id)};
        
    //     // const result = await taskCollection.updateOne(filter, update);
    //     // res.send(result)
    // })

    app.patch('/task/ongoing/:id', async(req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id)};
        const update = {
            $set: {
                status: 'ongoing'
            }
        };
        const result = await taskCollection.updateOne(filter, update);
        res.send(result)
    })
    app.patch('/task/completed/:id', async(req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id)};
        const update = {
            $set: {
                status: 'completed'
            }
        };
        const result = await taskCollection.updateOne(filter, update);
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
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Tasky server running successfully!')
})
app.listen(port, () => {
    console.log('Server is running from port', port)
})