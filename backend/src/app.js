import express from "express";
import { defaultRouter } from "./default/defaultRouter.js";
import userRouter from "./users/usersRouter.js";
import { generateBlogRouter } from "./generateBlog/generateBlogRouter.js";

const app = express();

// Middleware
app.use(express.json());

// Routers
app.use("/api/users", userRouter);           // User related routes
app.use("/api/blog", generateBlogRouter);    // Blog / AI generation routes

// Default catch-all route (last)
app.use("/api", defaultRouter);

export default app;