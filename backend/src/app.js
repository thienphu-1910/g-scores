import express from "express";
import morgan from "morgan";
import "dotenv/config"

const app = express();
app.use(morgan("dev"));

const port = Number.parseInt(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})