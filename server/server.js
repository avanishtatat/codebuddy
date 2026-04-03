require("dotenv").config();
const express = require("express");
const cors = require("cors"); 
const connectDB = require("./config/db");


const app = express(); 

app.use(cors()); 
app.use(express.json()); 

// Connecting Database
connectDB();

app.get('/', (req,res) => {
  res.send('CodeBuddy API is running');
}); 

const Port = process.env.PORT || 8000

app.listen(Port, () => {
  console.log(`Server is running at http://localhost:${Port}`);
});