# Shopify Theme

This is a custom Shopify theme built with Liquid, pure CSS, and JavaScript.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Update the `config.yml` file with your store's information:
   - Replace `YOUR_API_TOKEN_HERE` with your Shopify API token
   - Replace `YOUR_THEME_ID_HERE` with your theme ID
   - Replace `your-store-name.myshopify.com` with your actual store URL

## Development

To start development and watch for changes:
```
npm run watch
```

This will start a local development server that will sync changes to your Shopify store in real-time.

To deploy your theme to Shopify:
```
npm run deploy
```

## Folder Structure

```
├── assets/
│   ├── application.js
│   └── application.css
├── config/
│   ├── settings_data.json
│   └── settings_schema.json
├── layout/
│   └── theme.liquid
├── locales/
│   └── en.default.json
├── sections/
│   ├── header.liquid
│   └── footer.liquid
├── snippets/
│   └── product-card.liquid
├── templates/
│   ├── index.liquid
│   ├── product.liquid
│   ├── collection.liquid
│   ├── cart.liquid
│   └── page.liquid
└── src/
    └── js/
```

## Customization

The theme can be customized through the Shopify admin panel using the theme editor. Most sections and settings are configurable through the `settings_schema.json` file.

## CSS Structure

The theme uses a pure CSS approach with a BEM-like naming convention:

- Base styles for typography, reset, and common elements
- Component styles for specific UI elements (header, footer, product cards, etc.)
- Utility classes for common spacing, alignment, and responsive needs

All styles are contained in a single `application.css` file for simplicity and performance. 