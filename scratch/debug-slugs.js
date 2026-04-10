
const API_URL = "https://daylight.com.ng/graphql"; // Real WP URL

async function testQuery(slug) {
  const query = `
    query GetPostDetails($slug: ID!, $name: String!) {
      post(id: $slug, idType: SLUG) {
        title
        slug
      }
      posts(where: { name: $name }) {
        nodes {
          title
          slug
        }
      }
    }
  `;

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: { slug, name: slug }
    })
  });

  const json = await res.json();
  console.log(`Testing Slug: ${slug}`);
  console.log(JSON.stringify(json, null, 2));
}

// Replace with slugs found by the subagent
testQuery("apc-is-nigerias-only-tested-vehicle-for-progressive-governance-says-tinubu");
testQuery("terrorism-court-convicts-18-boko-haram-suspects");
