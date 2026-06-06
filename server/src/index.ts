import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;

app.use(express.json());
app.use(cors({
    origin : process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));

app.use("/health", (req: Request, res: Response) => {
    res.json({
        status : "OK",
        message : "FuseMeld API is Working"
    })
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`);
})