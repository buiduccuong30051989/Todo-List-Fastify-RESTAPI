const fastify = require("fastify");
const mongoose = require("mongoose");
const routes = require("./routes");
const { Options } = require("./config/swagger");
const { config } = require("./config/app");
const env = process.env.NODE_ENV;
const fastifySwagger = require("@fastify/swagger");
const fastifySwaggerUI = require("@fastify/swagger-ui");

const { MongoClient, ServerApiVersion } = require("mongodb");
import { ConnectOptions } from "mongoose";

const port = process.env.PORT || 3001;

// const uri =
//     "mongodb+srv://frontendcuong30051989:002Dxpdd2qU2FrRR@cluster0.xkmavbs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = "mongodb+srv://frontendcuong30051989:002Dxpdd2qU2FrRR@cluster0.xkmavbs.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=Cluster0";
// const client = new MongoClient(uri);

// async function connectToDatabase() {
//   try {
//     await client.connect();
//     const db = client.db('todo-app');
//     tasksCollection = db.collection('tasks');
//     console.log('Connected to the database');
//   } catch (error) {
//     console.error('Error connecting to the database:', error);
//   }
// }

// async function run() {
//     try {
//         // Connect the client to the server	(optional starting in v4.7)
//         await client.connect();

//         // Send a ping to confirm a successful connection
// await client.db("admin").command({ ping: 1 });
// const users = await client
//     .db("sample_mflix")
//     .collection("users")
//     .find()
//     .toArray();
//         console.log("List of users:");
//         console.log(users);
//         console.log(
//             "Pinged your deployment. You successfully connected to MongoDB!",
//         );
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }

// run();

// Configure App
const app = fastify.default({ logger: true });

app.register(fastifySwagger, Options);
app.register(fastifySwaggerUI, {
    routePrefix: "/docs",
    uiConfig: {
        docExpansion: "full",
        deepLinking: false,
    },
});

routes.forEach((route) => {
    app.register((app, options, done) => {
        app.route(route);
        done();
    });
});

// Define a schema
const UserSchema = new mongoose.Schema(
    {},
    { collection: "users", strict: false },
);

// Define a model
const User = mongoose.model("User", UserSchema, "users");

mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions)
    .then(async () => {
        app.log.info("MongoDB connected...");

        // Query data
        const users = await User.find().exec();
        console.log("List of users:");
        console.log(users);
    })
    .catch((err) => console.log(err));

const start = async (): Promise<void> => {
    try {
        await app.ready();
        app.swagger();
        await app.listen(port, () => console.log(`Example app listening on port ${port}!`));
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();

export default app;

// Configure DB
// if (env !== "test") {
//     mongoose
//         .connect(
//             `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`,
//             {},
//         )
//         .then(() => app.log.info("MongoDB connected..."))
//         .catch((err) => app.log.error(err));
// }

mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions)
    .then(() => app.log.info("MongoDB connected..."))
    .catch((err) => app.log.error(err));
