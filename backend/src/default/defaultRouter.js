import express from "express"
import pool from "../config/db.js"

const defaultRouter = express.Router();

const defaultReturn = {
  success : true,
  message: "This is Default Route"
}

const missingReturn = {
  success: false,
  message: "404 Page not Found"
}
const test_db_Return = {
  success: true,
  message: "Database Connected Successfully!"
};



defaultRouter.get("/", (req, res)=>{
  return res.status(200).json(defaultReturn)
  })

defaultRouter.use((err,req,res,next) =>{
    return res.status(404).json(missingReturn)
    next(err);
  })
  
export {defaultRouter}