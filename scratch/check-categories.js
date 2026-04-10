
const API_URL = "https://daylight.com.ng/graphql";

async function checkCategories() {
  const query = `
    query GetCategoriesDebug {
      categories(first: 50) {
        nodes {
          name
          slug
          count
        }
      }
    }
  `;

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });

  const json = await res.json();
  console.log(JSON.stringify(json.data.categories.nodes, null, 2));
}

checkCategories();
