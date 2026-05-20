import express from "express";
import cors from "cors";
import { setupSwagger } from "./docs/swagger.js";
import { router } from "./routes/index.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", router);
setupSwagger(app);
export { app };
