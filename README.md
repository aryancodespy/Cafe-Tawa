# Cafe Tawa

The public website for **Cafe Tawa**, a neighbourhood restaurant and café in Dhanmondi, Dhaka.

**Website:** https://cafetawa.com/

## Website

A lightweight, responsive single-page site built with plain HTML, CSS and vanilla JavaScript. No build step or JavaScript framework is required.

- Restaurant-led visual identity with the existing black-and-gold logo
- Real restaurant interior and food photography already included in this repository
- Food menu with accessible category tabs and keyboard navigation
- Directions, click-to-call, email and Pathao Food delivery links
- Responsive mobile navigation, reduced-motion support, semantic markup and social sharing metadata

## Run locally

Open `index.html` in a browser, or serve the repository with any static HTTP server:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000/.

## Edit the site

- `index.html`: content, menu, image references, SEO and contact links
- `css/cafe-tawa.css`: typography, colours, layout and responsive styling
- `js/cafe-tawa.js`: navigation and accessible menu tabs
- `images/`: existing logos and photography

The homepage deliberately does **not** load the old template's vendor CSS or JavaScript. Some legacy template assets remain in this repository for reference.

## Before publishing

1. **Confirm the menu and in-house prices.** These were preserved from the previous website and currently differ from some delivery-menu prices.
2. **Confirm opening hours.** Existing website and third-party directory hours conflict, so the redesigned page asks visitors to call rather than publishing an unverified schedule.
3. Confirm the Pathao Food listing and contact details are still active.
4. Review image rights and replace any inherited stock photography with original Cafe Tawa photos when available.
5. Test the site on real iOS, Android and desktop browsers. No visual browser automation was performed as part of the repository edit.

## Acknowledgements

This repository originally included the Lounge template by StyleShout, distributed by ThemeWagon. The original `readme.md` and legacy template assets have been kept for reference and attribution. The redesigned homepage, `css/cafe-tawa.css` and `js/cafe-tawa.js` use a new, independent layout and interaction system.
