const pool = require("./db");

const categories = [
  "Electronics",
  "Books",
  "Fashion",
  "Sports",
  "Home"
];

async function seedProducts() {

  try {

    const totalProducts = 200000;
    const batchSize = 5000;

    console.log("Starting seed...");

    for (let batch = 0; batch < totalProducts; batch += batchSize) {

      let values = [];
      let placeholders = [];
      let paramIndex = 1;

      for (let i = 0; i < batchSize; i++) {

        const productNumber = batch + i + 1;

        const category =
          categories[Math.floor(Math.random() * categories.length)];

        const price =
          (Math.random() * 1000).toFixed(2);

        const randomDate = new Date(
          Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
        );

        placeholders.push(
          `($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`
        );

        values.push(
          `Product ${productNumber}`,
          category,
          price,
          randomDate,
          randomDate
        );
      }

      await pool.query(
        `
        INSERT INTO products
        (name, category, price, created_at, updated_at)
        VALUES ${placeholders.join(",")}
        `,
        values
      );

      console.log(
        `${Math.min(batch + batchSize, totalProducts)} products inserted`
      );
    }

    console.log("Finished seeding 200000 products");

    process.exit();

  } catch (error) {

    console.error(error);
    process.exit(1);

  }
}

seedProducts();