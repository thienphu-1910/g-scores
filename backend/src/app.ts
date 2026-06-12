import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import { searchRouter } from "./routes/search.route.js";
import morgan from "morgan";
import cors from "cors";
import { reportRouter } from "./routes/report.route.js";
import { topScoresRouter } from "./routes/topScores.route.js";

const app = express();
const PORT = (process.env.PORT) || 3000;

app.use(express.json());
app.use(morgan('dev'));
app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allowedHeaders: ["Content-Type", "Accept"],    
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from TypeScript Express API!" });
});

app.use('/api', searchRouter);
app.use('/api', reportRouter);
app.use('/api', topScoresRouter)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});