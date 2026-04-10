const { getCategories } = require('./src/lib/wp-api');

async function check() {
  const cats = await getCategories();
  console.log(JSON.stringify(cats, null, 2));
}

check();
