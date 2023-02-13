import express from "express";
import bodyParser from "body-parser";
import config from "config";
import mongoose from "mongoose";

import productsRoutes from "./routes/products.routes.js";
import usersRoutes from "./routes/users.routes.js";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/products", productsRoutes);
app.use("/api/users", usersRoutes);

const PORT = process.env.PORT || config.get("port") || 8081;

async function start() {
  try {
    await mongoose
      .connect(config.get("mongoUri"), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("DB ok"));
  } catch (e) {
    console.log("Server erdror", e.message);
    process.exit(1);
  }
}

start();

app.listen(PORT, () => console.log(`Сервер включен на на ${PORT} порту`));
