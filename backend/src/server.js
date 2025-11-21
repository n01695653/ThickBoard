import express from  "express";
import noteRoutes from "./routes/notesRoutes.js"
import { connectdb } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
const PORT  = process.env.PORT || 5001;
connectdb();

app.use(cors({
    origin: "http://localhost:5173",
}))
//middleware = a function which run between request and response 
app.use(express.json()) // this will parse(allow) json bodies : req.body

app.use((req,res,next) => {
    console.log(`Req method id ${req.method} & Req url is ${req.url}`)
    next();
})

//  prefixing the /api/notes and string them in notesRoutes
app.use("/api/notes",noteRoutes )

app.listen(5001, () =>{
    console.log("Server started at Port :",PORT)
})

// 