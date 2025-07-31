# Terms Query Block

The Terms Query block is an advanced block that allows displaying taxonomy terms based on different query parameters and visual configurations. It works similarly to the Query block but for taxonomy terms instead of posts.

## Features

- Query taxonomy terms with various parameters (taxonomy, order, orderby, hide_empty, etc.)
- Support for hierarchical taxonomies
- Multiple display layouts (list, grid)
- Inner blocks for customizing term display
- Inspector controls for query configuration

## Block Structure

The Terms Query block consists of:

1. **Terms Query** (`core/terms-query`) - The main container block
2. **Terms Template** (`core/terms-template`) - Template for individual terms

## Default Template

By default, the Terms Template includes:
- Term Name

## Query Parameters

The Terms Query block supports the following query parameters:

- `taxonomy` - The taxonomy to query (default: 'category')
- `perPage` - Number of terms per page
- `pages` - Number of pages to query
- `order` - Order direction ('asc' or 'desc')
- `orderBy` - Order by field ('name', 'slug', 'term_id', 'count')
- `hideEmpty` - Whether to hide terms with no posts
- `hierarchical` - Whether to show hierarchical structure
- `parent` - Parent term ID for hierarchical queries, set to 0 to show only top-level terms
- `exclude` - Array of term IDs to exclude
- `include` - Array of term IDs to include

## Usage Example

```html
<!-- wp:terms-query {"termQueryId":0,"termQuery":{"taxonomy":"category","order":"asc","orderBy":"name"}} -->
<ul class="wp-block-terms-query">
  <!-- wp:terms-template -->
  <li class="wp-block-term">
    <!-- term content -->
  </li>
  <!-- /wp:terms-template -->
</ul>
<!-- /wp:terms-query -->
```

## Block Variations



## Context

The Terms Query block provides the following context to its inner blocks:

- `termQueryId` - Unique identifier for the query
- `termQuery` - Query parameters
- `termId` - The current term ID
- `taxonomy` - The current taxonomy slug

## Styling

The block supports:
- Alignment controls
- Color settings (background, text, link)
- Typography controls
- Spacing controls
- Border controls
- Layout controls

## Server-side Rendering

The block includes PHP server-side rendering for:
- Query execution using `WP_Term_Query`
- Context filtering for inner blocks
- Proper HTML structure generation
- Term class application
