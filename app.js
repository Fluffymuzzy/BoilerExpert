// Import required modules
const express = require("express");
const responseHelper = require("express-response-helper").helper();
const cookieParser = require("cookie-parser");

// Import route modules
const mainRoutes = require("./server/routes/mainRoutes");
const adminRoutes = require("./server/routes/adminRoutes");

// Create an instance of the express applicationc
const app = express();

// Define the router
const router = express.Router();

// Configure middleware
app.use("/app", router); // Mount the router at "/app"
app.use(responseHelper); // Add the responseHelper middleware
app.use(express.json()); // Parse incoming request bodies as JSON
app.use(express.urlencoded({ extended: true })); // Parse incoming request bodies with URL-encoded payloads
app.use(cookieParser()); // Parse cookies
app.use(express.static(__dirname + "/src")); // Serve static files from "/src"
app.set("view engine", "pug"); // Set the view engine to Pug

// Mount the route modules at the root level
app.use("/", mainRoutes);
app.use("/", adminRoutes);

// Start the server
const port = 3000;
const hostname = "localhost";
app.listen(port, (err) => {
  if (err) {
    console.error("There was a problem starting the server:", err);
    return;
  }
  console.log(`Server started at http://${hostname}:${port}`);
});

// Export the router
module.exports = router;
