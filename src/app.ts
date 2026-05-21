import express from "express";
import cors from "cors";
import { setupSwagger } from "./docs/swagger.js";
import { router } from "./routes/index.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api", router);
setupSwagger(app);
export { app };
