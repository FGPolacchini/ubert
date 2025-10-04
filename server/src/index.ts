import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import weatherRoutes from "./routes/weatherRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
	res.send("uBert is here to help, my lord!");
});

app.use("/weather", weatherRoutes);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
