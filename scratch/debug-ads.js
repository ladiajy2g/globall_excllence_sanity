import { getAdvertsByPlacement } from "../src/lib/wp-api.js";

async function debug() {
  console.log("--- ADVERT DIAGNOSTICS ---");
  const placements = ["top-banner", "hero-bottom", "between-sections", "home-grid"];
  
  for (const p of placements) {
    console.log(`\nChecking placement: ${p}`);
    try {
      const ads = await getAdvertsByPlacement(p, 10);
      console.log(`Count: ${ads?.length || 0}`);
      if (ads?.length > 0) {
        ads.forEach((ad, i) => {
          console.log(`  Ad ${i+1}: "${ad.title}"`);
          console.log(`    Link: ${ad.adLink}`);
          console.log(`    Image: ${ad.featuredImage?.node?.sourceUrl || "MISSING"}`);
          console.log(`    Placements: ${ad.adPlacements?.nodes?.map(n => n.slug).join(", ")}`);
        });
      }
    } catch (err) {
      console.error(`Error fetching ${p}:`, err.message);
    }
  }
}

debug();
