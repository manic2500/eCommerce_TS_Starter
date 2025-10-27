import { configDotenv } from "dotenv";
import express from "express";

configDotenv()

const app = express();
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Working 12345")
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})