const pool = require("./config/db");

const hotels = [
  {
    title: "The Taj Mahal Palace, Mumbai",
    description: "An iconic 1903 heritage luxury hotel facing the Gateway of India, boasting opulent rooms, world-class restaurants, and breathtaking views of the Arabian Sea.",
    image_path: "/uploads/the-taj-mahal-palace-mumbai.avif",
    latitude: 18.9217,
    longitude: 72.8332,
    price: 28000.00,
  },
  {
    title: "The Oberoi Udaivilas, Udaipur",
    description: "Set on the tranquil banks of Lake Pichola, this majestic resort features traditional Mewar architecture, decorative fountains, expansive courtyards, and lush gardens.",
    image_path: "/uploads/the-oberoi-udaivilas.webp",
    latitude: 24.5772,
    longitude: 73.6734,
    price: 42000.00,
  },
  {
    title: "The Oberoi Amarvilas, Agra",
    description: "Located just 600 metres from the Taj Mahal, this luxury retreat features Mughal-inspired architecture, reflection pools, terraced lawns, and panoramic views of the monument.",
    image_path: "/uploads/the-oberoi-amarvilas.webp",
    latitude: 27.1682,
    longitude: 78.0494,
    price: 35000.00,
  },
  {
    title: "Taj Lake Palace, Udaipur",
    description: "An ethereal white-marble palace built in 1746 floating in the centre of Lake Pichola, offering royal heritage rooms, bespoke butler services, and private boat transfers.",
    image_path: "/uploads/taj-lake-palace.avif",
    latitude: 24.5754,
    longitude: 73.6800,
    price: 38000.00,
  },
  {
    title: "Rambagh Palace, Jaipur",
    description: "The former residence of the Maharaja of Jaipur, featuring opulent palatial suites, hand-carved marble latticework, elaborate gardens, and royal dining venues.",
    image_path: "/uploads/rambagh-palace.jpg",
    latitude: 26.8979,
    longitude: 75.8085,
    price: 32000.00,
  },
  {
    title: "Taj Falaknuma Palace, Hyderabad",
    description: "Perched 2,000 feet above the city of pearls, this opulent Italian-marble palace was the residence of the Nizam, showcasing priceless art, crystal chandeliers, and grand dining halls.",
    image_path: "/uploads/taj-falaknuma-palace.webp",
    latitude: 17.3314,
    longitude: 78.4677,
    price: 30000.00,
  },
  {
    title: "The Leela Palace, New Delhi",
    description: "A stunning grand palace in the heart of the Diplomatic Enclave, combining Lutyens architectural grandeur with Indian royal flair, complete with a rooftop infinity pool.",
    image_path: "/uploads/the-leela-palace-new-delhi.jpg",
    latitude: 28.5796,
    longitude: 77.1868,
    price: 22000.00,
  },
  {
    title: "The Leela Palace, Chennai",
    description: "Chennai's premier seafront palace hotel drawing architectural inspiration from Chettinad royal palaces, featuring regal ballrooms, infinity sea views, and award-winning dining.",
    image_path: "/uploads/leela-palace-chennai.jpeg",
    latitude: 13.0108,
    longitude: 80.2662,
    price: 15000.00,
  },
  {
    title: "ITC Grand Chola, Chennai",
    description: "A grand architectural tribute to Southern India's golden Chola dynasty, boasting hand-carved temple pillars, expansive palatial interiors, and ten signature restaurants.",
    image_path: "/uploads/itc-grand-chola-chennai.jpg",
    latitude: 13.0105,
    longitude: 80.2206,
    price: 12500.00,
  },
  {
    title: "Taj Fisherman's Cove Resort & Spa, Mahabalipuram",
    description: "Built on the ramparts of an authentic 18th-century Dutch fort along the Coromandel coast, featuring private villas, white sand beaches, and rejuvenating Ayurvedic wellness.",
    image_path: "/uploads/taj-fishermans-cove-resort-spa-mahabalipuram.jpg",
    latitude: 12.7938,
    longitude: 80.2520,
    price: 16000.00,
  },
  {
    title: "Palais de Mahé, Puducherry",
    description: "A French-colonial heritage hotel nestled in the vibrant French Quarter of Pondicherry, showcasing colonnaded verandas, high ceilings, a tranquil central courtyard pool, and gourmet cuisine.",
    image_path: "/uploads/palais-de-mahe-puducherry.webp",
    latitude: 11.9310,
    longitude: 79.8335,
    price: 11000.00,
  },
  {
    title: "Taj Coromandel, Chennai",
    description: "An iconic landmark of elegance in the business district of Nungambakkam, renowned for refined luxury, bespoke experiences, and distinguished Southern Indian culinary excellence.",
    image_path: "/uploads/taj-coromandel.avif",
    latitude: 13.0601,
    longitude: 80.2443,
    price: 10500.00,
  },
];

async function seedDatabase() {
  try {
    console.log("Seeding hotels into PostgreSQL database...");

    // Create table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hotels (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image_path VARCHAR(500) NOT NULL,
        latitude NUMERIC(10,6) NOT NULL,
        longitude NUMERIC(10,6) NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Clear existing to avoid duplicates on re-seed
    await pool.query("TRUNCATE TABLE hotels RESTART IDENTITY;");

    for (const h of hotels) {
      await pool.query(
        `INSERT INTO hotels (title, description, image_path, latitude, longitude, price)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [h.title, h.description, h.image_path, h.latitude, h.longitude, h.price]
      );
      console.log(` Added: ${h.title}`);
    }

    console.log(`\n Successfully seeded ${hotels.length} hotels into database!`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seedDatabase();
