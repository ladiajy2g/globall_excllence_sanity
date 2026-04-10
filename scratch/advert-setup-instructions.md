Instructions to activate adverts after WordPress setup:

1. Add the code from scratch/wordpress-advert-setup.php to your WordPress theme's functions.php

2. In WordPress Admin, go to: WPGraphQL > Settings > Enable Data
   - Enable "Advert" post type
   - Enable "Ad Placements" taxonomy

3. In wp-api.js (line 416-422), remove the bypass:
   
   Change from:
   ```
   return [];
   ```
   
   To enable the query, remove lines 416-422 and uncomment lines 424-458.

4. Create test adverts in WordPress:
   - Go to Adverts > Add New
   - Add a title
   - Upload a featured image (banner)
   - Select a placement from "Ad Placements" box
   - Add adLink if you want the image to be clickable