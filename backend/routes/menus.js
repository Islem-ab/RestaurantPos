const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all menu items
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM menus ORDER BY category, name");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch menus" });
  }
});

// GET single menu item
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM menus WHERE id = ?", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch menu item" });
  }
});

// POST create menu item
router.post("/", async (req, res) => {
  const { name, price, category, image } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO menus (name, price, category, image) VALUES (?, ?, ?, ?)",
      [name, price, category || 'autre', image || null]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create menu item" });
  }
});

// PUT update menu item
router.put("/:id", async (req, res) => {
  const { name, price, category, image } = req.body;
  try {
    await db.query(
      "UPDATE menus SET name = ?, price = ?, category = ?, image = ? WHERE id = ?",
      [name, price, category, image, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

// DELETE menu item
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM menus WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

module.exports = router;