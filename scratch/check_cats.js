
const { getCategories } = require('./src/lib/wp-api');

async function test() {
  const cats = await getCategories();
  console.log(JSON.stringify(cats, null, 2));
}

test();
