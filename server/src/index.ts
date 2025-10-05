import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import weatherRoutes from "./routes/weatherRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Get request to "/" that sends back some text. Mainly used for testing purposes
app.get("/", (req, res) => {
	res.send("uBert is here to help, my lord!");
});

// Redirect request for "/weather" to the weather router
app.use("/weather", weatherRoutes);

// Start the server on the port
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
