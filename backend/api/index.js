import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import { routes } from './routes/routes.js';


dotenv.config();
const app = express();

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://e-commerce-v2-dycs.vercel.app",
      "https://e-commerce-v2-lyart.vercel.app",
      "http://localhost:3000"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


app.use(cookieParser())
app.use(express.json());

app.get("/", (req, res) => res.send("Express och vercel är bästtttttttttttttttttttttttt"));

app.use(routes);


app.listen(3030, () => console.log("Server ready on port 3030....."));