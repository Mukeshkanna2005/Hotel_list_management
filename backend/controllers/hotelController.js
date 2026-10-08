const pool = require("../config/db");
const path = require("path");
const fs = require("fs");

// GET /api/hotels?search=&minPrice=&maxPrice=&offset=&limit=
const getHotels = async (req, res) => {
  try {
    const { search, minPrice, maxPrice, offset, limit } = req.query;

    const conditions = [];
    const values = [];
    let paramIndex = 1;

    // Filter by title (case-insensitive)
    if (search && search.trim()) {
      conditions.push(`LOWER(title) LIKE $${paramIndex}`);
      values.push(`%${search.trim().toLowerCase()}%`);
      paramIndex++;
    }

    // Filter by minimum price
    if (minPrice !== undefined && minPrice !== "" && !isNaN(Number(minPrice))) {
      conditions.push(`price >= $${paramIndex}`);
      values.push(Number(minPrice));
      paramIndex++;
    }

    // Filter by maximum price
    if (maxPrice !== undefined && maxPrice !== "" && !isNaN(Number(maxPrice))) {
      conditions.push(`price <= $${paramIndex}`);
      values.push(Number(maxPrice));
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";

    // Calculate total matching records for pagination
    const countResult = await pool.query(
      `SELECT COUNT(*) AS total FROM hotels${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].total, 10);

    // Build data query
    let dataQuery = `SELECT * FROM hotels${whereClause} ORDER BY created_at DESC`;
    const dataValues = [...values];

    // Apply offset and limit if provided
    if (limit !== undefined && limit !== "") {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        dataQuery += ` LIMIT $${dataValues.length + 1}`;
        dataValues.push(limitNum);

        if (offset !== undefined && offset !== "") {
          const offsetNum = parseInt(offset, 10);
          if (!isNaN(offsetNum) && offsetNum >= 0) {
            dataQuery += ` OFFSET $${dataValues.length + 1}`;
            dataValues.push(offsetNum);
          }
        }
      }
    }

    const result = await pool.query(dataQuery, dataValues);

    res.set("X-Total-Count", String(total));

    // If pagination parameters were passed, return structured object
    if (limit !== undefined || offset !== undefined) {
      return res.json({
        hotels: result.rows,
        total,
      });
    }

    // Otherwise return array for backwards compatibility
    res.json(result.rows);
  } catch (err) {
    console.error("getHotels error:", err.message);
    res.status(500).json({ error: "Failed to fetch hotels" });
  }
};

// GET /api/hotels/:id
const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM hotels WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("getHotelById error:", err.message);
    res.status(500).json({ error: "Failed to fetch hotel" });
  }
};

// POST /api/hotels
const createHotel = async (req, res) => {
  try {
    const { title, description, latitude, longitude, price } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required." });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ error: "Description is required." });
    }

    const lat = Number(latitude);
    if (latitude === undefined || latitude === null || String(latitude).trim() === "" || isNaN(lat)) {
      return res.status(400).json({ error: "Please enter a valid latitude." });
    }
    if (lat < -90 || lat > 90) {
      return res.status(400).json({ error: "Latitude must be between -90 and 90." });
    }

    const lng = Number(longitude);
    if (longitude === undefined || longitude === null || String(longitude).trim() === "" || isNaN(lng)) {
      return res.status(400).json({ error: "Please enter a valid longitude." });
    }
    if (lng < -180 || lng > 180) {
      return res.status(400).json({ error: "Longitude must be between -180 and 180." });
    }

    const priceNum = Number(price);
    if (price === undefined || price === null || String(price).trim() === "" || isNaN(priceNum) || priceNum <= 0) {
      return res.status(400).json({ error: "Price must be greater than 0." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Please select a hotel image." });
    }

    const image_path = `/uploads/${req.file.filename}`;

    const result = await pool.query(
      `INSERT INTO hotels (title, description, image_path, latitude, longitude, price)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title.trim(), description.trim(), image_path, lat, lng, priceNum]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("createHotel error:", err.message || err.code || err);
    res.status(500).json({ error: "Failed to create hotel" });
  }
};

// PUT /api/hotels/:id
const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, latitude, longitude, price } = req.body;

    const existing = await pool.query("SELECT * FROM hotels WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    const current = existing.rows[0];

    // Field-level validation
    const updatedTitle = title !== undefined ? title.trim() : current.title;
    if (!updatedTitle) {
      return res.status(400).json({ error: "Title is required." });
    }

    const updatedDescription = description !== undefined ? description.trim() : current.description;
    if (!updatedDescription) {
      return res.status(400).json({ error: "Description is required." });
    }

    let lat = current.latitude;
    if (latitude !== undefined) {
      lat = Number(latitude);
      if (String(latitude).trim() === "" || isNaN(lat)) {
        return res.status(400).json({ error: "Please enter a valid latitude." });
      }
      if (lat < -90 || lat > 90) {
        return res.status(400).json({ error: "Latitude must be between -90 and 90." });
      }
    }

    let lng = current.longitude;
    if (longitude !== undefined) {
      lng = Number(longitude);
      if (String(longitude).trim() === "" || isNaN(lng)) {
        return res.status(400).json({ error: "Please enter a valid longitude." });
      }
      if (lng < -180 || lng > 180) {
        return res.status(400).json({ error: "Longitude must be between -180 and 180." });
      }
    }

    let priceNum = current.price;
    if (price !== undefined) {
      priceNum = Number(price);
      if (String(price).trim() === "" || isNaN(priceNum) || priceNum <= 0) {
        return res.status(400).json({ error: "Price must be greater than 0." });
      }
    }

    // Handle image update
    let image_path = current.image_path;
    if (req.file) {
      image_path = `/uploads/${req.file.filename}`;

      // Remove previous custom upload if not shared with another hotel
      const oldPath = current.image_path;
      if (oldPath && oldPath.startsWith("/uploads/")) {
        const sameImage = await pool.query(
          "SELECT id FROM hotels WHERE image_path = $1 AND id != $2",
          [oldPath, id]
        );
        if (sameImage.rows.length === 0) {
          const oldFile = path.join(__dirname, "..", oldPath);
          if (fs.existsSync(oldFile)) {
            try {
              fs.unlinkSync(oldFile);
            } catch (unlinkErr) {
              console.error("Failed to delete old image:", unlinkErr.message);
            }
          }
        }
      }
    }

    const result = await pool.query(
      `UPDATE hotels
       SET title = $1, description = $2, image_path = $3, latitude = $4, longitude = $5, price = $6
       WHERE id = $7
       RETURNING *`,
      [updatedTitle, updatedDescription, image_path, lat, lng, priceNum, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("updateHotel error:", err.message);
    res.status(500).json({ error: "Failed to update hotel" });
  }
};

// DELETE /api/hotels/:id
const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await pool.query("SELECT * FROM hotels WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    const imagePath = existing.rows[0].image_path;

    // Check if any other hotel uses the same image before deleting file
    const sameImage = await pool.query(
      "SELECT id FROM hotels WHERE image_path = $1 AND id != $2",
      [imagePath, id]
    );

    await pool.query("DELETE FROM hotels WHERE id = $1", [id]);

    if (
      sameImage.rows.length === 0 &&
      imagePath &&
      imagePath.startsWith("/uploads/")
    ) {
      const fullPath = path.join(__dirname, "..", imagePath);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (unlinkErr) {
          console.error("Failed to delete image file:", unlinkErr.message);
        }
      }
    }

    res.json({ message: "Hotel deleted successfully" });
  } catch (err) {
    console.error("deleteHotel error:", err.message);
    res.status(500).json({ error: "Failed to delete hotel" });
  }
};

module.exports = { getHotels, getHotelById, createHotel, updateHotel, deleteHotel };
