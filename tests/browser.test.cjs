const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');

test('documentation navigation, cross-links, responsive layout and fixed dark theme', async () => {
  const mime = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.md':'text/plain','.svg':'image/svg+xml'};
  const server = http.createServer(async(req,res)=>{
    try {
      const pathname = new URL(req.url,'http://localhost').pathname;
      const file = path.resolve('.'+(pathname==='/'?'/index.html':pathname));
      if(!file.startsWith(process.cwd()+path.sep)){res.writeHead(403).end();return;}
      res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
      res.end(await fs.readFile(file));
    } catch {res.writeHead(404).end();}
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  let browser;
  try {
    browser=await chromium.launch();
    const page=await browser.newPage({viewport:{width:1440,height:900}});
    await page.route('https://cdn.jsdelivr.net/**',route=>route.fulfill({path:route.request().url().includes('/marked@')?'node_modules/marked/lib/marked.umd.js':'node_modules/dompurify/dist/purify.min.js',contentType:'application/javascript'}));
    await page.route('https://fonts.googleapis.com/**',route=>route.abort());
    const url='http://127.0.0.1:'+server.address().port;
    await page.goto(url);
    assert.equal(await page.locator('link[rel="icon"]').getAttribute('href'),'assets/favicon.svg');
    const favicon = await page.request.get(url+'/assets/favicon.svg');
    assert.equal(favicon.status(),200);
    assert.match(favicon.headers()['content-type'],/image\/svg\+xml/);
    assert.match(await favicon.text(),/<svg\b/);
    await page.locator('#article h1').filter({hasText:'Documentation'}).waitFor();
    assert.equal(await page.locator('#page-nav > a').count(),8);
    assert.equal(await page.locator('#page-nav details').count(),0);
    assert.equal(await page.locator('.brand-name').evaluate(e=>e.tagName),'SPAN');
    assert.equal(await page.locator('a.brand-name').count(),0);
    assert.equal(await page.locator('.marquee-toggle').count(),0);
    const ticker = page.locator('.header-links');
    const original = ticker.locator('.marquee-group:not([aria-hidden])');
    assert.equal(await original.locator('a').count(),11);
    // Check spacing, clipping and sustained movement at the reported wide viewport,
    // plus a viewport larger than one complete set of links.
    for (const width of [1440, 1920, 2560, 900, 390]) {
      await page.setViewportSize({width,height:900});
      await page.mouse.move(0,899);
      await page.waitForFunction(()=>{
        const n=document.querySelector('.header-links'), g=n.querySelector('.marquee-group:not([aria-hidden])');
        return n.scrollWidth-n.clientWidth >= Math.round(g.getBoundingClientRect().width)-1;
      });
      const geometry=await ticker.evaluate(n=>{
        const g=n.querySelector('.marquee-group:not([aria-hidden])'), items=[...g.children];
        const brand=document.querySelector('.brand-name').getBoundingClientRect();
        const box=n.getBoundingClientRect();
        return {
          gap:Math.min(...items.slice(1).map((item,i)=>item.getBoundingClientRect().left-items[i].getBoundingClientRect().right)),
          endGap:parseFloat(getComputedStyle(g).paddingRight),
          clipped:box.right<=innerWidth && (box.left>=brand.right || (innerWidth<=420 && box.top>=brand.bottom-1)) && getComputedStyle(n).overflowX==='auto',
          noOverflow:document.documentElement.scrollWidth<=innerWidth+1
        };
      });
      assert.ok(geometry.gap>=8 && geometry.endGap>=8,JSON.stringify(geometry));
      assert.ok(geometry.clipped && geometry.noOverflow,JSON.stringify(geometry));
      const before=await ticker.evaluate(n=>({x:n.scrollLeft,cycle:n.querySelector('.marquee-group:not([aria-hidden])').getBoundingClientRect().width}));
      await page.waitForFunction(({x,cycle})=>{
        const n=document.querySelector('.header-links');
        return (n.scrollLeft-x+cycle)%cycle>=18;
      },before,{timeout:4000});
    }
    await page.setViewportSize({width:1440,height:900});
    // Hover pauses auto-scroll, but wheel input still wraps both ways.
    await ticker.hover();
    const cycle = await ticker.evaluate(n=>n.querySelector('.marquee-group:not([aria-hidden])').getBoundingClientRect().width);
    const phase = x=>((x%cycle)+cycle)%cycle;
    const closePhase = (a,b)=>Math.min(phase(a-b),phase(b-a))<3;
    await ticker.evaluate((n,w)=>{n.scrollLeft=w+12;},cycle);
    for (const delta of [-40, Math.round(cycle*3+75), -Math.round(cycle*4+100), 120]) {
      const before = await ticker.evaluate(n=>n.scrollLeft);
      await page.mouse.wheel(delta,0);
      await page.waitForFunction(({before,delta,w})=>{
        const n=document.querySelector('.header-links'), mod=x=>((x%w)+w)%w;
        return Math.min(mod(n.scrollLeft-before-delta),mod(before+delta-n.scrollLeft))<3 &&
          n.scrollLeft>=w-2 && n.scrollLeft<2*w+2;
      },{before,delta,w:cycle});
      const after=await ticker.evaluate(n=>n.scrollLeft);
      assert.ok(closePhase(after,before+delta));
      assert.ok(Math.abs(after-before)>5);
    }
    const held=await ticker.evaluate(n=>n.scrollLeft);
    await page.waitForTimeout(250);
    assert.equal(await ticker.evaluate(n=>n.scrollLeft),held);
    // Native scrolling has physical buffers at both ends.
    for(const side of ['start','end']){
      await ticker.evaluate((n,s)=>{n.scrollLeft=s==='start'?0:n.scrollWidth-n.clientWidth;},side);
      await page.waitForFunction(w=>{
        const x=document.querySelector('.header-links').scrollLeft;
        return x>=w-2 && x<2*w+2;
      },cycle);
    }
    await page.mouse.move(0,899);
    const resumed=await ticker.evaluate(n=>n.scrollLeft);
    await page.waitForFunction(({x,w})=>((document.querySelector('.header-links').scrollLeft-x)%w+w)%w>12,{x:resumed,w:cycle},{timeout:3000});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.waitForTimeout(100);
    const still=await ticker.evaluate(n=>n.scrollLeft);
    await page.waitForTimeout(250);
    assert.equal(await ticker.evaluate(n=>n.scrollLeft),still);
    await ticker.hover();
    await page.mouse.wheel(-Math.round(cycle*2+70),0);
    await page.waitForFunction(({x,w})=>Math.abs(document.querySelector('.header-links').scrollLeft-x)>10,{x:still,w:cycle});
    assert.equal(await original.locator('a').count(),11);
    assert.equal(await ticker.locator('.marquee-group[aria-hidden="true"] a:not([tabindex="-1"])').count(),0);
    await page.mouse.move(0,899);
    await page.emulateMedia({reducedMotion:'no-preference'});
    const fullscreen = () => page.evaluate(()=>{
      const main=document.querySelector('main').getBoundingClientRect();
      const workspace=document.querySelector('#workspace').getBoundingClientRect();
      return Math.abs(workspace.bottom-innerHeight)<=1 && main.bottom<=workspace.bottom+1 &&
        document.documentElement.scrollHeight<=innerHeight+1 && document.documentElement.scrollWidth<=innerWidth+1;
    });
    assert.equal(await fullscreen(),true);
    assert.equal(await page.locator('main').evaluate(e=>getComputedStyle(e).overflowY),'auto');
    assert.equal(await page.locator('#sidebar').evaluate(e=>getComputedStyle(e).overflowY),'auto');
    assert.equal(await page.locator('#menu-toggle').isVisible(),false);
    await page.setViewportSize({width:1920,height:1080});
    assert.equal(await fullscreen(),true);
    assert.equal(await page.locator('main').evaluate(e=>e.clientWidth>1200),true);
    await page.setViewportSize({width:1440,height:900});
    assert.equal(await page.locator('meta[name="color-scheme"]').count(),1);
    assert.equal(await page.locator('html').evaluate(e=>getComputedStyle(e).colorScheme),'dark');
    await page.locator('#article').getByRole('link',{name:'keep',exact:true}).click();
    await page.locator('#article h1').filter({hasText:'keep'}).waitFor();
    assert.equal(new URL(page.url()).searchParams.get('page'),'keep-readme');
    for (const id of ['installation','usage','architecture-and-development','verification']) {
      assert.equal(await page.locator('#article h2[id="'+id+'"]').count(),1);
    }
    await page.goto(url+'/?page=keep-usage');
    await page.locator('#article h2#usage').waitFor();
    assert.equal(new URL(page.url()).searchParams.get('page'),'keep-readme');
    assert.equal(new URL(page.url()).hash,'#usage');
    assert.equal(await page.locator('#page-nav [aria-current="page"]').innerText(),'keep');
    assert.equal(await page.locator('#theme-toggle').count(),0);
    await page.evaluate(()=>localStorage.setItem('namthedev-docs-theme','light'));
    await page.reload();
    await page.locator('#article h1').waitFor();
    assert.equal(await page.locator('html').getAttribute('data-bs-theme'),'dark');
    assert.equal(await page.locator('html').evaluate(e=>getComputedStyle(e).colorScheme),'dark');
    assert.equal(await page.locator('#outline').isVisible(),true);
    assert.ok(await page.locator('#outline-links a').count()>0);
    await page.setViewportSize({width:390,height:844});
    assert.equal(await fullscreen(),true);
    await page.locator('#sidebar').waitFor({state:'hidden'});
    await page.locator('#outline').waitFor({state:'hidden'});
    await page.locator('#mobile-toc').waitFor({state:'visible'});
    await page.locator('#menu-toggle').waitFor({state:'visible'});
    await page.locator('#menu-toggle').click();
    await page.locator('#sidebar').waitFor({state:'visible'});
    assert.equal(await page.locator('#page-filter').count(),0);
    await page.locator('#page-nav').getByRole('link',{name:'clipboard',exact:true}).click();
    await page.locator('#article h1').filter({hasText:'clipboard'}).waitFor();
    assert.equal(await page.locator('#article h3#http-api').count(),1);
    assert.equal(await page.locator('#sidebar').isVisible(),false);
    assert.equal(await fullscreen(),true);
    await page.locator('#menu-toggle').click();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'false');
  } finally {
    await browser?.close();
    await new Promise(resolve=>server.close(resolve));
  }
});
