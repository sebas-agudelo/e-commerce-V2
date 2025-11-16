import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import { routes } from './routes/routes.js';

dotenv.config();
const app = express();
 app.use(cors({
        origin: ["https://e-commerce-v2-dycs.vercel.app", "http://localhost:3000"],
        credentials: true
    }));

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Express och vercel är bästa saken som finns.........");
});

app.use(routes);

app.listen(3030, () => console.log("Server ready on port 3030....."));