const express = require("express");
const mongoose = require("mongoose");
const cors  = require("cors")
const bodyParser = require("body-parser");

require("dotenv").config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URL)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB error:", err));

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model("Contact", contactSchema);

app.get("/contact",async(req,res)=>{

  try {
    const data = await Contact.find();
    res.status(200).json({"data":data})
  } catch (error) {
    res.status(400).json({"data":"fucked..."})
    
  }
})
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.json({
        success: false,
        message: "All fields are required."
      });
    }

    const newMessage = await Contact.create({ name, email, message });

    return res.json({
      success: true,
      data: newMessage
    });

  } catch (error) {
    console.log("Error saving message:", error);

    return res.json({
      success: false,
      message: "Server error. Try again later."
    });
  }
});


// ------------------------------------------------------
// 5. Server Start
// ------------------------------------------------------

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});