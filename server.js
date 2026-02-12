import "dotenv/config";
import connectDB from "./src/config/db.js";
import app from "./src/app.js";

connectDB();
const port= process.env.PORT;

app.listen(port,(err)=>{
    if(err){
        console.log("error while running the server",err)
    }else{
        console.log(`server running successfully at http://localhost:${port}`)
    }
});