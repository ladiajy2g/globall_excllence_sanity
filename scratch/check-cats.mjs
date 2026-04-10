import { getCategories } from './src/lib/wp-api.js';
const cats = await getCategories();
console.log(JSON.stringify(cats, null, 2));
