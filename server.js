const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Fuse = require('fuse.js');
const faqs = require('./faqs.json'); // Import the FAQs JSON data

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS

// Combine all FAQ sections into a single array for searching
const allFAQs = Object.values(faqs).flat();

// Fuse.js options for fuzzy searching
const options = {
  keys: [
    { name: 'question', weight: 0.7 },
    { name: 'answer', weight: 0.3 },
  ],
  threshold: 0.2, // Lower value makes search stricter
};

// Initialize Fuse.js with the combined FAQ data and options
const fuse = new Fuse(allFAQs, options);

// API route to handle search queries
app.post('/search', (req, res) => {
  const { query } = req.body;

  // Check if query is provided and has a minimum length
  if (!query || typeof query !== 'string' || query.length < 2) {
    return res.status(400).json({ error: 'Query is required, must be a string, and at least 2 characters long.' });
  }

  // Normalize query
  const normalizedQuery = query.trim().toLowerCase();

  // Perform the search
  const results = fuse.search(normalizedQuery);

  // Check for exact matches
  const exactMatches = results.filter(result => result.score === 0);
  
  // Log the number of exact matches
  console.log(`Number of exact matches found: ${exactMatches.length}`);

  if (exactMatches.length > 1) {
    return res.status(400).json({ error: 'Insufficient information: multiple exact matches found.' });
  }

  // Return the best match if exists
  if (exactMatches.length === 1) {
    return res.json({
      query,
      result: exactMatches[0].item,
    });
  }

  // Return the best fuzzy match if no exact matches are found
  if (results.length > 0) {
    const bestMatch = results[0].item;
    if (bestMatch) {
      return res.json({
        query,
        result: bestMatch,
      });
    }
  }

  // If no results found
  res.json({
    query,
    result: null,
    message: 'No matches found.',
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
