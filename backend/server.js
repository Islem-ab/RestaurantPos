const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const menusRoutes = require("./routes/menus");
const ordersRoutes = require("./routes/orders");

app.use("/api/menus", menusRoutes);
app.use("/api/orders", ordersRoutes);

// Serve images folder to the frontend
app.use("/images", express.static(__dirname + "/images"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});