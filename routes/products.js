const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  console.log("NEW ROUTE HIT");
  console.log("Query Params:", req.query);

  try {
    
    const limit = Number(req.query.limit) || 20;

    const category = req.query.category;
    const cursorUpdatedAt = req.query.cursorUpdatedAt;
    const cursorId = req.query.cursorId;

    let query = `
      SELECT *
      FROM products
    `;

    let conditions = [];
    let values = [];

    // Category filter
    if (category) {
      values.push(category);
      conditions.push(`category = $${values.length}`);
    }

    // Cursor pagination
    if (cursorUpdatedAt && cursorId) {
      values.push(cursorUpdatedAt);
      values.push(cursorId);

      conditions.push(
        `(updated_at, id) < ($${values.length - 1}, $${values.length})`
      );
    }

    // Add WHERE clause if needed
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    values.push(limit);

    query += `
      ORDER BY updated_at DESC, id DESC
      LIMIT $${values.length}
    `;
    console.log("Category:", category);
console.log("Query:", query);
console.log("Values:", values); 
    const result = await pool.query(query, values);

    let nextCursor = null;

    if (result.rows.length > 0) {
      const lastProduct = result.rows[result.rows.length - 1];

      nextCursor = {
        cursorUpdatedAt: lastProduct.updated_at,
        cursorId: lastProduct.id,
      };
    }

    res.json({
      products: result.rows,
      nextCursor,
      count: result.rows.length
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server Error",
    });
  }
});

module.exports = router;