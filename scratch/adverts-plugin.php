<?php
/**
 * Daylight NG - WordPress Setup for Adverts
 * Add this to your theme's functions.php or create a custom plugin
 */

// 1. Register Advert Post Type with GraphQL support
function daylight_register_advert_cpt() {
    $labels = array(
        'name' => 'Adverts',
        'singular_name' => 'Advert',
    );
    $args = array(
        'label' => 'Adverts',
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_icon' => 'dashicons-megaphone',
        'supports' => array('title', 'thumbnail'),
        'show_in_graphql' => true,
        'graphql_single_name' => 'advert',
        'graphql_plural_name' => 'adverts',
    );
    register_post_type('advert', $args);
}
add_action('init', 'daylight_register_advert_cpt');

// 2. Register Ad Placements Taxonomy with GraphQL support
function daylight_register_ad_placements_tax() {
    $labels = array(
        'name' => 'Ad Placements',
        'singular_name' => 'Ad Placement',
    );
    $args = array(
        'label' => 'Ad Placements',
        'hierarchical' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'adPlacement',
        'graphql_plural_name' => 'adPlacements',
    );
    register_taxonomy('ad_placements', array('advert'), $args);
}
add_action('init', 'daylight_register_ad_placements_tax');

// 3. Register custom fields for GraphQL
function daylight_register_ad_meta() {
    register_post_meta('advert', 'adLink', array(
        'type' => 'string',
        'single' => true,
        'show_in_rest' => true,
        'show_in_graphql' => true,
    ));
    register_post_meta('advert', 'adVideoUrl', array(
        'type' => 'string',
        'single' => true,
        'show_in_rest' => true,
        'show_in_graphql' => true,
    ));
}
add_action('init', 'daylight_register_ad_meta');

// 4. Create default placements on init
function daylight_create_placements() {
    $placements = array(
        'top-banner' => 'Top Banner',
        'footer-banner' => 'Footer Banner',
        'hero-bottom' => 'Hero Bottom',
        'between-sections' => 'Between Sections',
        'home-grid' => 'Home Grid',
        'article-sidebar' => 'Article Sidebar',
    );
    foreach ($placements as $slug => $name) {
        if (!term_exists($slug, 'ad_placements')) {
            wp_insert_term($name, 'ad_placements', array('slug' => $slug));
        }
    }
}
add_action('init', 'daylight_create_placements');

// 5. Add meta box for ad fields
function daylight_add_ad_meta_box() {
    add_meta_box('daylight_advert_fields', 'Advert Details', 'daylight_ad_meta_cb', 'advert', 'normal', 'high');
}
add_action('add_meta_boxes', 'daylight_add_ad_meta_box');

function daylight_ad_meta_cb($post) {
    $ad_link = get_post_meta($post->ID, 'adLink', true);
    $ad_video = get_post_meta($post->ID, 'adVideoUrl', true);
    ?>
    <p><label><strong>Advert Link:</strong></label></p>
    <input type="url" name="adLink" value="<?php echo esc_attr($ad_link); ?>" style="width:100%;padding:8px;" placeholder="https://example.com">
    <p style="margin-top:15px"><label><strong>Video URL (YouTube):</strong></label></p>
    <input type="url" name="adVideoUrl" value="<?php echo esc_attr($ad_video); ?>" style="width:100%;padding:8px;" placeholder="https://youtube.com/watch?v=...">
    <?php
}

function daylight_save_ad($post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (current_user_can('edit_post', $post_id)) {
        if (isset($_POST['adLink'])) update_post_meta($post_id, 'adLink', esc_url($_POST['adLink']));
        if (isset($_POST['adVideoUrl'])) update_post_meta($post_id, 'adVideoUrl', esc_url($_POST['adVideoUrl']));
    }
}
add_action('save_post_advert', 'daylight_save_ad');