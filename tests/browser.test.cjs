const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');

test('documentation navigation, cross-links, responsive layout and fixed dark theme', async () => {
  const mime = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.md':'text/plain'};
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
    await page.locator('#article h1').filter({hasText:'Documentation'}).waitFor();
    assert.equal(await page.locator('#page-nav details').count(),8);
    const desktopLayout = await page.evaluate(()=>{
      const sidebar=document.querySelector('#sidebar').getBoundingClientRect(), main=document.querySelector('main').getBoundingClientRect();
      return Math.abs(sidebar.top-main.top)<=1 && sidebar.right <= main.left+1 && sidebar.width < main.width &&
        sidebar.left===0 && Math.abs(main.right-(document.querySelector("#outline").hidden?innerWidth:document.querySelector("#outline").getBoundingClientRect().left))<=1 && Math.abs(main.bottom-innerHeight)<=1;
    });
    assert.equal(desktopLayout,true);
    assert.equal(await page.locator('main').evaluate(e=>getComputedStyle(e).overflowY),'auto');
    assert.equal(await page.locator('#sidebar').evaluate(e=>getComputedStyle(e).overflowY),'auto');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1),true);
    await page.setViewportSize({width:1920,height:1080});
    assert.equal(await page.locator('main').evaluate(e=>e.clientWidth>1200),true);
    assert.equal(await page.locator('#reading-column').evaluate(e=>e.clientWidth<850),true);
    await page.setViewportSize({width:1440,height:900});
    assert.equal(await page.locator('meta[name="color-scheme"]').count(),1);
    assert.equal(await page.locator('html').evaluate(e=>getComputedStyle(e).colorScheme),'dark');
    await page.locator('#article').getByRole('link',{name:'keep',exact:true}).click();
    await page.locator('#article h1').filter({hasText:'keep'}).waitFor();
    assert.equal(new URL(page.url()).searchParams.get('page'),'keep-readme');
    await page.locator('#article').getByRole('link',{name:'User guide',exact:true}).click();
    await page.locator('#article h1').filter({hasText:'User guide'}).waitFor();
    assert.equal(new URL(page.url()).searchParams.get('page'),'keep-usage');
    assert.equal(await page.locator('#theme-toggle').count(),0);
    await page.evaluate(()=>localStorage.setItem('namthedev-docs-theme','light'));
    await page.reload();
    await page.locator('#article h1').waitFor();
    assert.equal(await page.locator('html').getAttribute('data-bs-theme'),'dark');
    assert.equal(await page.locator('html').evaluate(e=>getComputedStyle(e).colorScheme),'dark');
    assert.equal(await page.locator('#outline').isVisible(),true);
    assert.ok(await page.locator('#outline-links a').count()>0);
    assert.equal(await page.locator('#breadcrumbs').innerText(),'Docs / keep / User guide');
    await page.setViewportSize({width:390,height:844});
    assert.equal(await page.evaluate(()=>document.querySelector('#sidebar').getBoundingClientRect().bottom <= document.querySelector('main').getBoundingClientRect().top),true);
    assert.equal(await page.locator('body').evaluate(e=>e.classList.contains('dvh-100')),false);
    assert.equal(await page.locator('#outline').isVisible(),false);
    assert.equal(await page.locator('#mobile-toc').isVisible(),true);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await page.locator('#navigation').evaluate(e=>e.open=true);
    await page.locator('#page-filter').fill('clipboard');
    assert.equal(await page.locator('#page-nav details').count(),1);
    await page.locator('#page-nav').getByRole('link',{name:'Overview',exact:true}).click();
    await page.locator('#article h1').filter({hasText:'clipboard'}).waitFor();
    assert.equal(await page.locator('#navigation').evaluate(e=>e.open),false);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  } finally {
    await browser?.close();
    await new Promise(resolve=>server.close(resolve));
  }
});
