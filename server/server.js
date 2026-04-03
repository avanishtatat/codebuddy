require("dotenv").config();
const express = require("express");
const cors = require("cors"); 
const connectDB = require("./config/db");


const app = express(); 

app.use(cors()); 
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('CodeBuddy API is running');
}); 

const port = process.env.PORT || 8000

(async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
})(); 