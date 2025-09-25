// app.js
import express from "express";
import config from "./config/config.js";
import { defaultRouter } from "./default/defaultRouter.js";
import userRouter from "./users/usersRouter.js"
import { generateBlogRouter } from "./generateBlog/generateBlogRouter.js";

const app = express();

// Middleware (if any)
app.use(express.json());

// Add routers here

app.use("/api/", userRouter); 
app.use("/api/", generateBlogRouter)

// Routes Default add this in last
app.use("/api/", defaultRouter);

// Export app so server.js can use it
export default app;