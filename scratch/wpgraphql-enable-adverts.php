<?php
/**
 * Add to your WordPress functions.php to enable Advert post type and ad_placements taxonomy in WPGraphQL
 */

add_filter( 'graphql_post_types', function( $post_types ) {
    $post_types['advert'] = get_post_type_object( 'advert' );
    return $post_types;
});

add_filter( 'graphql_taxonomies', function( $taxonomies ) {
    $taxonomies['ad_placements'] = get_taxonomy( 'ad_placements' );
    return $taxonomies;
});