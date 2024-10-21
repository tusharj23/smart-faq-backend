// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');  // Import cors
// const Fuse = require('fuse.js');
// const faqs = require('./faqs.json'); // Importing the FAQs JSON data

// const app = express();
// const PORT = process.env.PORT || 5001;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());  // Enable CORS

// // Combine all FAQ sections into a single array for searching
// const allFAQs = Object.values(faqs).flat();

// // Fuse.js options for fuzzy searching
// const options = {
//   keys: ['question', 'answer'],
//   threshold: 0.3, // Lower value makes search stricter
// };

// // Initialize Fuse.js with the combined FAQ data and options
// const fuse = new Fuse(allFAQs, options);

// // API route to handle search queries
// app.post('/search', (req, res) => {
//   const { query } = req.body;
//   if (!query) {
//     return res.status(400).json({ error: 'Query is required' });
//   }

//   // Perform the search
//   const results = fuse.search(query);

//   // Map the results to return only the FAQ entries
//   const formattedResults = results.map(result => result.item);

//   res.json({
//     query,
//     results: formattedResults,
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
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
  keys: ['question', 'answer'],
  threshold: 0.3, // Lower value makes search stricter
};

// Initialize Fuse.js with the combined FAQ data and options
const fuse = new Fuse(allFAQs, options);

// API route to handle search queries
app.post('/search', (req, res) => {
  const { query } = req.body;
  
  // Check if query is provided
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query is required and must be a string' });
  }

  // Perform the search
  const results = fuse.search(query);

  // Map the results to return only the FAQ entries
  const formattedResults = results.map(result => result.item);

  res.json({
    query,
    results: formattedResults,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
