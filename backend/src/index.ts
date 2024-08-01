import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

const port = process.env.PORT;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "initial setup done from backend",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
