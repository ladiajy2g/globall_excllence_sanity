const fetch = require('node-fetch');

async function getCategories() {
  const url = 'https://backend.daylightng.com/graphql';
  const query = `
    query GetCategories {
      categories(first: 20) {
        nodes {
          name
          slug
          count
        }
      }
    }
  `;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const json = await response.json();
    console.log(JSON.stringify(json, null, 2));
  } catch (err) {
    console.error(err);
  }
}

getCategories();
