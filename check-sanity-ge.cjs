const { createClient } = require('@sanity/client');

const projectId = 'eak1a0g6';
const dataset = 'production';

const client = createClient({
  projectId,
  dataset,
  useCdn: false,
  apiVersion: '2024-04-01'
});

async function run() {
  const cats = [
    'opinion', 'breaking', 'brands', 'lifestyle'
  ];

  try {
    for (const slug of cats) {
      const count = await client.fetch('count(*[_type == "post" && count(categories[@->slug.current == $slug]) > 0])', { slug });
      console.log(`${slug}: ${count}`);
    }
    
    const advertCount = await client.fetch('count(*[_type == "advert"])');
    console.log(`adverts: ${advertCount}`);
  } catch (err) {
    console.error(err.message);
  }
}

run();
