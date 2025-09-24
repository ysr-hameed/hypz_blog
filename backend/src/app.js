// app.js
import express from "express";
import config from "./config/config.js";
import { defaultRouter } from "./default/defaultRouter.js";
import userRouter from "./users/usersRouter.js"

const app = express();

// Middleware (if any)
app.use(express.json());

// Add rputers here

app.use(userRouter);


// Routes Default add this in last
app.use(defaultRouter);

// Export app so server.js can use it
export default app;