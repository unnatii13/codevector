const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// Import products route
const productsRoute = require("./routes/products");

// Register route
app.use("/products", productsRoute);

app.get("/", (req, res) => {
  res.send("Server Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});