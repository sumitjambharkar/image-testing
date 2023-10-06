const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const dotenv = require('dotenv')
const app = express();
dotenv.config()
const port = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/image", express.static("image"));

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const imageSchema = new mongoose.Schema({
  url: String,
});

const Image = mongoose.model("Image", imageSchema);

let imageName = "";

const storage = multer.diskStorage({
  destination: path.join("./image"),
  filename: function (req, file, cb) {
    imageName = Date.now() + path.extname(file.originalname);
    cb(null, imageName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 3000000 },
}).single("myImage");

app.post("/upload-image", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Error uploading image" });
    } else {
      const imageUrl = `https://modafinia.com/image/${imageName}`;

      try {
        // Save the image URL to the database
        await Image.create({ url: imageUrl });

        return res.status(201).json({ message: "Image added", imageUrl });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error saving image to database" });
      }
    }
  });
});

app.listen(port, () => {
  console.log("Server running on port", port);
});
