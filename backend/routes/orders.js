const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all orders
router.get("/", async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT 
        o.id,
        o.date,
        o.total,
        GROUP_CONCAT(
          CONCAT(oi.name, ' x', oi.quantity)
          SEPARATOR ', '
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id, o.date, o.total
      ORDER BY o.id DESC
    `);
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// GET single order by ID
router.get("/:id", async (req, res) => {
  try {
    const [orderRows] = await db.query(
      "SELECT * FROM orders WHERE id = ?",
      [req.params.id]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const [items] = await db.query(
      "SELECT * FROM order_items WHERE order_id = ?",
      [req.params.id]
    );

    const order = {
      ...orderRows[0],
      items: items.map(item => ({
        id: item.menu_item_id,
        name: item.name,
        price: parseFloat(item.price),
        qty: item.quantity,
        category: item.category
      }))
    };

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// POST create new order
router.post("/", async (req, res) => {
  const { items, total } = req.body;
  const date = new Date().toLocaleString("fr-TN", { timeZone: "Africa/Tunis" });

  try {
    const [result] = await db.query(
      "INSERT INTO orders (date, total) VALUES (?, ?)",
      [date, total]
    );

    const orderId = result.insertId;

    // Insert all order items
    for (const item of items) {
      await db.query(
        `INSERT INTO order_items (order_id, menu_item_id, name, price, quantity, category) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.id, item.name, item.price, item.qty, item.category || 'autre']
      );
    }

    res.json({ success: true, orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// PUT update order
router.put("/:id", async (req, res) => {
  const { items, total } = req.body;
  const orderId = req.params.id;
  const date = new Date().toLocaleString("fr-TN", { timeZone: "Africa/Tunis" });

  try {
    // Update order
    await db.query(
      "UPDATE orders SET date = ?, total = ? WHERE id = ?",
      [date, total, orderId]
    );

    // Delete old items
    await db.query("DELETE FROM order_items WHERE order_id = ?", [orderId]);

    // Insert new items
    for (const item of items) {
      await db.query(
        `INSERT INTO order_items (order_id, menu_item_id, name, price, quantity, category) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.id, item.name, item.price, item.qty, item.category || 'autre']
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update order" });
  }
});

// DELETE order
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM order_items WHERE order_id = ?", [req.params.id]);
    await db.query("DELETE FROM orders WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

module.exports = router;