# Cafe Tawa — Restaurant & Coffee Shop

Official website repository for **Cafe Tawa**, Hussein Plaza, Road 15 (New) / 28 (Old), Dhanmondi, Dhaka.

Site: https://cafetawa.com/

## Pages

- `index.html` — welcome, venue photography, featured menu categories, automatically sliding testimonials and contact details.
- `menu.html` — food and coffee menu with verified delivery-listed prices and clearly separated old menu entries.
- `moments.html` — all eight images preserved from the older site's gallery.
- `reviews.html` — all four original testimonials in an accessible carousel, plus five visibly labeled fictional sample reviews.
- `data/menu.json` — editable menu data, price source, original source URL and verification date.

## Branding

Uses the **original Cafe Tawa logo** from `images/Summer.png`, not the replacement black-and-gold logo. The current palette is midnight navy, pearl ivory, pale blue-grey and restrained coral, designed to complement the original red-and-blue logo. The site keeps Fraunces for headings and DM Sans for body copy. The original venue and food photos already in the repo are used as editorial photography; photos do **not** claim to depict every named dish. Avoid copying third-party delivery-listing images without permission.

## Menu prices and provenance

The 18 priced menu entries are from the public **Cafe Tawa — Dhanmondi** listing on Pathao Food, checked 11 October 2026:

https://food.pathao.com/restaurants/gq2tgoi/cafe-tawa

- Delivery prices can differ from dine-in prices and may change.
- `From` marks the lowest listed price when Pathao offers multiple portion options.
- Ten items appearing on the old website but not confirmed in the listing are marked **Previously featured** with no speculative prices.
- No matching, current Foodpanda or Foodi page was verifiable. Never import menu details from other restaurants.
- Opening hours shown on the previous website conflict with external listings; the website retains them with a **call ahead** notice.

## Guest reviews

The four original testimonials are copied verbatim from the older website; their authenticity has **not** been independently verified. Five additional reviews appear only as clearly labeled **fictional writing examples** on the reviews page. They use made-up names and are **not customer endorsements**. Replace them with authentic, permission-cleared customer feedback before claiming them as genuine. The automatically sliding carousel pauses on hover, keyboard focus, when the browser tab is hidden, or when the visitor prefers reduced motion. Visitors can also choose slides manually.

## Design maintenance

- `css/cafe-tawa-palette.css` loads after the original CSS and refresh layers on all four pages. Change the colours there, rather than creating further competing overrides.
- Keep the existing **Fraunces** and **DM Sans** font declarations unchanged.
- Decorative emoji and arrow ornaments have been removed, while functional carousel navigation controls are retained.

## Development

Static HTML, CSS and vanilla JavaScript. No build tools needed. Serve locally using:

```bash
python -m http.server 8000
```

Run tests with Node.js 22:

```bash
node --test tests/site-audit.cjs
```

GitHub Actions runs the quality checks on pull requests and on main.

## Relevant files

- `css/cafe-tawa.css` — base layout
- `css/cafe-tawa-extras.css` — photo gallery styles
- `css/cafe-tawa-refresh.css` — updated brand, menu and carousel visual system
- `js/cafe-tawa.js` — accessible navigation and autoplay carousel

## Deployment checklist

1. Confirm current dine-in prices and available dishes with Cafe Tawa.
2. Confirm store opening hours.
3. Confirm ownership and permissible use of all photos and testimonials before reuse in adverts.
4. Test on actual iOS, Android and desktop browsers.
5. Confirm deployment at cafetawa.com after merging to main.

## Original template attribution

Legacy assets and `readme.md` remain for attribution and historical reference. The original site used the StyleShout Lounge template distributed by ThemeWagon. The new site uses independent layout and scripts.
