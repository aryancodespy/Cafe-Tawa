const {test} = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname,"..");
const read = p => fs.readFileSync(path.join(root,p),"utf8");
const pages = Object.fromEntries(["index.html","menu.html","moments.html","reviews.html"].map(p=>[p,read(p)]));
const menuData = JSON.parse(read("data/menu.json"));

test("all four pages have semantic structure and metadata",()=>{
  for(const [page,html] of Object.entries(pages)){
    assert.equal((html.match(/<h1\b/g)||[]).length,1,page);
    assert.equal((html.match(/<main\b/g)||[]).length,1,page);
    assert.equal((html.match(/<section\b/g)||[]).length,(html.match(/<\/section>/g)||[]).length,page);
    assert.match(html,/<title>[^<]+<\/title>/);
    assert.match(html,/<meta name="description"/);
    assert.match(html,/<link rel="canonical"/);
  }
});
test("internal anchors, HTML pages and file references exist",()=>{
  for(const [file,html] of Object.entries(pages)){
    const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
    assert.equal(new Set(ids).size,ids.length,file+" duplicated ID");
    for(const [,part] of html.matchAll(/(?:src|href)="([^"]+)"/g)){
      const value=part.replaceAll("&amp;","&").split("?")[0];
      if(value.startsWith("#")){
        assert.ok(value==="#top"||ids.includes(value.slice(1)),file+" missing "+value);
      }else if(/^(?:images|css|js)\/|^favicon\.jpg$/.test(value)){
        assert.ok(fs.existsSync(path.join(root,decodeURIComponent(value))),file+" missing file "+value);
      }else if(/^[\w-]+\.html(?:#.*)?$/.test(value)){
        const [page,fragment]=value.split("#");
        assert.ok(pages[page],file+" missing page "+page);
        if(fragment) {
          const otherIds=[...pages[page].matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
          assert.ok(fragment==="top"||otherIds.includes(fragment),file+" broken link "+value);
        }
      }
    }
  }
});
test("original colorful Cafe Tawa logo restored on every page",()=>{
 for(const [page,html] of Object.entries(pages)){
   assert.match(html,/images\/Summer\.png/,page);
   assert.doesNotMatch(html,/images\/main%20logo\.png/,page);
 }
});
test("all 18 listing-sourced items and prices are present",()=>{
 const all=menuData.categories.flatMap(category=>category.items);
 assert.equal(all.length,18);
 const html=pages["menu.html"];
 for(const item of all){
   const near=html.slice(html.indexOf("<h3>"+item.name+"</h3>"));
   assert.ok(near.length>0 && near.length<html.length,"Missing "+item.name);
   const price=near.match(/<span class="catalog-item__price">([^<]+)<\/span>/)?.[1];
   assert.equal(price,(item.from?"From ":"")+"৳"+item.price,item.name);
 }
 assert.equal(menuData.source_url,"https://food.pathao.com/restaurants/gq2tgoi/cafe-tawa");
 assert.equal(menuData.checked_on,"2026-10-11");
 assert.match(html,/may differ in the restaurant/i);
});
test("unverified earlier items have no fabricated prices",()=>{
 const html=pages["menu.html"];
 assert.equal(menuData.previous_website_unconfirmed.length,10);
 for(const name of menuData.previous_website_unconfirmed) assert.ok(html.includes("<h3>"+name+"</h3>"),name);
 assert.doesNotMatch(html,/Price on request|Current availability not verified/);
 assert.match(html,/Please ask our team about availability and prices/);
});
test("all eight gallery photographs still exist",()=>{
 const html=pages["moments.html"];
 const photos=[...html.matchAll(/class="moments-photo moments-photo--\d+" href="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(photos.length,8);
 const old=["gallery-01.jpg","gallery-02.jpg","gallery-03.jpg","gallery-04.jpg","gallery-05.jpg","gallery-06.jpg","130541223_135856751661424_7557791355764471478_n.jpg","469578017_1083793163534440_3454982807789287247_n.jpg"];
 assert.deepEqual(photos.sort(),old.map(name=>"images/gallery/"+name).sort());
});
test("all four original guest reviews exist on the dedicated page and homepage",()=>{
 const quotes=[
 "এই ক্যাফেটি খুবই সুন্দর এবং আরামদায়ক। কফির স্বাদ চমৎকার এবং সার্ভিসও খুব ভালো। আবার আসবো অবশ্যই।",
 "Great ambiance and quality service. Their espresso and desserts are top-notch. Highly recommended for anyone visiting Dhaka.",
 "The coffee and pastries are fresh and delicious. Perfect place for relaxing and taking photos.",
 "One of the best coffee shops in Dhaka. The environment is very comfortable and relaxing. Their coffee tastes amazing and the service is very friendly."
 ];
 for(const name of ["index.html","reviews.html"]){
   const html=pages[name];
   assert.equal((html.match(/data-review-slide/g)||[]).length,4,name);
   for(const quote of quotes) assert.ok(html.includes(quote),name);
 }
});
test("review sliders autoplay but respect user controls and motion preferences",()=>{
 const js=read("js/cafe-tawa.js");
 assert.match(js,/setInterval/);
 assert.match(js,/5800/);
 assert.match(js,/prefers-reduced-motion/);
 assert.match(js,/focusin/);
 assert.match(js,/mouseenter/);
 assert.match(js,/visibilitychange/);
 for(const name of ["index.html","reviews.html"]){
   const html=pages[name];
   assert.match(html,/data-review-carousel/);
   assert.match(html,/data-carousel-prev/);
   assert.match(html,/data-carousel-next/);
   assert.match(html,/data-carousel-dots/);
 }
});
test("pages expose useful real links without dummy buttons",()=>{
 for(const [page,html] of Object.entries(pages)){
   assert.match(html,/tel:\+8801776018825/,page);
   assert.match(html,/mailto:admin@cafetawa.com/,page);
 }
 assert.match(pages["menu.html"],/food\.pathao\.com\/restaurants\/gq2tgoi\/cafe-tawa/);
 assert.match(pages["index.html"],/google\.com\/maps\/search/);
 assert.match(pages["index.html"],/href="menu.html"/);
});
test("mobile styling, focus outlines and motion control are present",()=>{
 const base=read("css/cafe-tawa.css"),refresh=read("css/cafe-tawa-refresh.css");
 assert.match(base,/@media \(max-width:560px\)/);
 assert.match(refresh,/@media\(max-width:560px\)/);
 assert.match(base,/:focus-visible/);
 assert.match(refresh,/prefers-reduced-motion/);
});
test("unnecessary ornamental symbols have been removed",()=>{
 for(const html of Object.values(pages)) assert.doesNotMatch(html,/✳|✨|🔥|⭐/);
});
test("hours remain qualified until confirmed",()=>{
 assert.match(pages["index.html"],/please call ahead/);
});

test("customer-facing copy uses natural wording without source badges",()=>{
 for(const [page,html] of Object.entries(pages)){
   assert.doesNotMatch(html,/Pathao listed|Previously featured|Previously listed|delivery-listed|testimonials retained from the original|carried over from the original/i,page);
 }
 const menu=pages["menu.html"];
 assert.equal((menu.match(/catalog-item__price/g)||[]).length,18);
 assert.equal((menu.match(/catalog-item--legacy/g)||[]).length,10);
 assert.doesNotMatch(menu,/catalog-item__tag/);
});
test("all aria-labelledby and menu category references resolve",()=>{
 for(const [page,html] of Object.entries(pages)){
   const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]));
   for(const [,references] of html.matchAll(/aria-labelledby="([^"]+)"/g)){
     for(const ref of references.split(/\s+/)) assert.ok(ids.has(ref),page+" unknown labelledby "+ref);
   }
 }
});
