import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import router from "./routes/chat.route.js"


dotenv.config()

const port=process.env.PORT
const app=express()
app.use(express.json())


app.use("/",router)

app.get("/",(req,res)=>{
    res.json({message:"hello from chat"})
})

app.listen(port,()=>{
    console.log(`Chat started at ${port}`)
    connectDB()
})