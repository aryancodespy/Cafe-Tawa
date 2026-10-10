const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = p => fs.readFileSync(path.join(root, p), "utf8");
const homepage = read("index.html");
const moments = read("moments.html");

test("pages use semantic headings and balanced sections", () => {
  for (const [name, html] of [["index.html", homepage], ["moments.html", moments]]) {
    assert.equal((html.match(/<h1\b/g) || []).length, 1, name);
    assert.equal((html.match(/<section\b/g) || []).length, (html.match(/<\/section>/g) || []).length, name);
    assert.equal((html.match(/<main\b/g) || []).length, 1, name);
    assert.match(html, /<title>[^<]+<\/title>/);
    assert.match(html, /<meta name="description"/);
  }
});

test("IDs are unique and same-page links resolve", () => {
  for (const [name, html] of [["index.html", homepage], ["moments.html", moments]]) {
    const ids = Array.from(html.matchAll(/\bid="([^"]+)"/g), m => m[1]);
    assert.equal(new Set(ids).size, ids.length, name);
    for (const [, fragment] of html.matchAll(/href="#([^"]+)"/g)) {
      assert.ok(fragment === "top" || ids.includes(fragment), name + ": #" + fragment);
    }
  }
});

test("all local referenced assets exist", () => {
  for (const html of [homepage, moments]) {
    for (const [, relative] of html.matchAll(/(?:href|src)="((?:images|css|js)\/[^"]+)"/g)) {
      const asset = decodeURIComponent(relative.split("?")[0]);
      assert.ok(fs.existsSync(path.join(root, asset)), asset);
    }
  }
});

test("preserves all 14 original menu items and prices", () => {
  const items = [
    ["Beef Tehari", 450], ["Chicken Biryani", 520], ["Kacchi Biryani", 490],
    ["Chicken Khichuri", 550], ["Mutton Khichuri", 520],
    ["Grill Chicken", 300], ["Tandoori Chicken", 370], ["Arabian Kabab", 340],
    ["Chicken Tikka", 390], ["Beef Chap", 390],
    ["White Rice", 340], ["Chicken Jhal Fry with Rice", 370],
    ["Beef Bhuna", 490], ["Fish", 450]
  ];
  const actual = Array.from(homepage.matchAll(/<span class="menu-items__name">([^<]+)<\/span><span class="menu-items__price">৳(\d+)<\/span>/g), m => [m[1], Number(m[2])]);
  assert.deepEqual(actual, items);
  assert.match(homepage, /Prices and availability can change/);
});

test("menu tabs point to accessible existing panels", () => {
  const controls = Array.from(homepage.matchAll(/role="tab" aria-controls="([^"]+)"/g), m => m[1]);
  assert.equal(controls.length, 3);
  for (const panel of controls) {
    assert.ok(homepage.includes('id="' + panel + '" role="tabpanel"'), panel);
  }
  const script = read("js/cafe-tawa.js");
  assert.match(script, /addEventListener\("keydown"/);
  assert.match(script, /aria-selected/);
});

test("preserves eight original gallery images", () => {
  const originals = ["gallery-01.jpg", "gallery-02.jpg", "gallery-03.jpg",
    "gallery-04.jpg", "gallery-05.jpg", "gallery-06.jpg",
    "130541223_135856751661424_7557791355764471478_n.jpg",
    "469578017_1083793163534440_3454982807789287247_n.jpg"];
  const photos = Array.from(moments.matchAll(/class="moments-photo moments-photo--\d+" href="([^"]+)"/g), m => m[1]);
  assert.equal(photos.length, 8);
  assert.deepEqual(photos.slice().sort(), originals.map(name => "images/gallery/" + name).sort());
});

test("preserves all four original review names and quotes", () => {
  const names = ["Shirin Begum", "Tanvir Hossain", "Nusrat Jahan", "Fahim Khan"];
  const quotations = [
    "এই ক্যাফেটি খুবই সুন্দর এবং আরামদায়ক। কফির স্বাদ চমৎকার এবং সার্ভিসও খুব ভালো। আবার আসবো অবশ্যই।",
    "Great ambiance and quality service. Their espresso and desserts are top-notch. Highly recommended for anyone visiting Dhaka.",
    "The coffee and pastries are fresh and delicious. Perfect place for relaxing and taking photos.",
    "One of the best coffee shops in Dhaka. The environment is very comfortable and relaxing. Their coffee tastes amazing and the service is very friendly."
  ];
  assert.equal((moments.match(/class="guest-quote"/g) || []).length, 4);
  for (const name of names) assert.ok(moments.includes(name), name);
  for (const quote of quotations) assert.ok(moments.includes(quote), quote);
});

test("all navigation, contact and delivery actions are linked", () => {
  assert.match(homepage, /href="moments.html"/);
  assert.match(moments, /href="index.html#menu"/);
  for (const html of [homepage, moments]) {
    assert.match(html, /href="tel:\+8801776018825"/);
    assert.match(html, /href="mailto:admin@cafetawa.com"/);
  }
  assert.match(homepage, /food\.pathao\.com\/restaurants\/gq2tgoi\/cafe-tawa/);
  assert.match(homepage, /google\.com\/maps\/search/);
});

test("previously listed hours are qualified", () => {
  assert.match(homepage, /Weekdays 10:00 AM/);
  assert.match(homepage, /weekends 9:00 AM/);
  assert.match(homepage, /please call ahead/);
});

test("responsive CSS and reduced motion rules exist", () => {
  const css = read("css/cafe-tawa.css");
  const extended = read("css/cafe-tawa-extras.css");
  assert.match(css, /@media \(max-width:560px\)/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(extended, /@media \(max-width:620px\)/);
});
