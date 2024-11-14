const express = require("express");
const app = express();
const dotenv = require("dotenv");
const user = require("./routes/userRoutes.js");
const events = require("./routes/eventRoutes.js");
const uploadRoutes = require("./utils/cloudinary.js");
const cookieParser = require("cookie-parser");

dotenv.config({ path: "./config/.env" });
const databaseConnection = require("./config/database.js");
app.use(express.json());
app.use(cookieParser());

databaseConnection();

app.use("/api/v1/users", user);
app.use("/api/v1/events", events);
app.use("/api/v1/upload", uploadRoutes);

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
