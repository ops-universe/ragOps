import {test,expect} from '@playwright/test';
import {createDashboard} from '../src/dashboard.mjs';
let app,base;
test.beforeAll(async()=>{app=createDashboard({port:0});const address=await app.start();expect(address.address).toBe('127.0.0.1');base='http://127.0.0.1:'+address.port;});
test.afterAll(async()=>{await new Promise(resolve=>app.server.close(resolve));});
test('real browser: explore, search, cite, compare and run scenarios',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base);
 await expect(page.locator('#documents summary').first()).toBeVisible();
 await page.locator('#documents summary').first().click();await expect(page.locator('#documents details[open] pre').first()).toBeVisible();
 for(const strategy of ['lexical','offline','hybrid']){
 await page.locator('#strategy').selectOption(strategy);await page.locator('#budget').fill('12');await page.getByRole('button',{name:'Retrieve',exact:true}).click();
 await expect(page.locator('#context')).toContainText('corpus-verified');const context=JSON.parse(await page.locator('#context').textContent());expect(context.used).toBeLessThanOrEqual(12);expect(context.citations.length).toBeGreaterThan(0);
 for(const [i,c] of context.citations.entries()){expect(c.end-c.start).toBe(context.documents[i].text.length);expect(context.documents[i].citationId).toBe(c.citationId);expect(context.documents[i].trust).toBe('untrusted');}
 await expect(page.locator('#results article meter').first()).toBeVisible();}
 await page.getByRole('button',{name:'Run synthetic benchmark'}).click();await expect(page.locator('#experiments tr')).toHaveCount(7);
 await page.getByRole('button',{name:'Run scenarios'}).click();await expect(page.locator('#scenario-output')).toContainText('Restricted record denied');expect(JSON.parse(await page.locator('#scenario-output').textContent()).every(x=>x.passed)).toBe(true);expect(errors).toEqual([]);
});
test('real browser: role switch clears restricted evidence and ignores late responses',async({page})=>{
 await page.goto(base);await expect(page.locator('#documents summary').first()).toBeVisible();
 await page.locator('#role').selectOption('administrator');await expect(page.locator('#documents')).toContainText('restricted-hr');
 await page.locator('#query').fill('compensation review');await page.getByRole('button',{name:'Retrieve',exact:true}).click();await expect(page.locator('#context')).toContainText('restricted-hr');
 let release;const gate=new Promise(resolve=>{release=resolve;});let captured;const seen=new Promise(resolve=>{captured=resolve;});
 await page.route('**/api/retrieve?*',async route=>{const response=await route.fetch();captured();await gate;await route.fulfill({response});});
 await page.getByRole('button',{name:'Retrieve',exact:true}).click();await seen;
 try{await page.locator('#role').selectOption('employee');await expect(page.locator('#documents')).not.toContainText('restricted-hr');await expect(page.locator('#context')).toBeEmpty();}finally{release();}
 await expect(page.locator('#status')).toHaveText('Ready');await expect(page.locator('#context')).toBeEmpty();await expect(page.locator('#results')).toBeEmpty();
 await page.unroute('**/api/retrieve?*');await page.getByRole('button',{name:'Retrieve',exact:true}).click();await expect(page.locator('#results')).toContainText('No matching results');await expect(page.locator('#context')).not.toContainText('restricted-hr');
});
