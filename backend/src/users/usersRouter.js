import express from "express";
import pool from "../config/db.js"
import bcrypt from "bcryptjs"

const userRouter = express.Router();

// Register User 

userRouter.post("/register", async (req,res,next)=>{
    const {first_name, last_name,email, password } = req.body;
    try {
      // Check all Fields
      if (!first_name || !last_name || !email || !password) {
        return res.status(401).json({
          success : false,
          message: "All fields are required."
        }) 
      }
      // Check password is 8 digit
      if (password.length < 8) {
        return res.status(401).json({
          success: false,
          message: "Minimum 8 digits in password."
        });
      }
      const checkEmailExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      
      if (checkEmailExists.rowCount > 0){
        return res.status(400).json({
          succes: false,
          message: "Email already Exist!"
        })
      }
      const passwordHash = bcrypt.hashSync(password, 10);
      // Return succes after checked All
      const result = await pool.query("INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1,$2,$3,$4) RETURNING email",[first_name,last_name,email,passwordHash]);
      
      return res.status(200).json({
        success: true,
        message: result.rows[0]
      })
      
      
    } catch (err) {
      return res.status(401).json({
          success: false,
          message: "Error : ", err
          });
    }
    
  })


userRouter.post("/login", async (req, res, next) =>{
  const {email, password } = req.body;

  
  
  try {
    if (!email || !password){
      return status(400).json({
        success: false,
        message: "All Fields are Required"
      })
    }
    const result = await pool.query("SELECT email, password_hash from users WHERE email = $1",[email])
    if (result.rowCount === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      })
    }
    
    const user = result.rows[0]
      
    const isMatch = bcrypt.compareSync(password, user.password_hash)
    
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      })
    }
    
    return res.status(200).json({
        success: true,
        message: "Login Successfull",
        email: user.email,
      })
    
    
    
  } catch (err) {
    console.error('Error:', err);
    
  }
});
export default userRouter