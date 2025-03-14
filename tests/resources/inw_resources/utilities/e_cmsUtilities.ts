import { expect } from '@playwright/test';

async function Lapland_Sourcepath_Checker(page: any, SourcePath: string, HOMEpath: string, ERRORpath: string) {
    const sourcePath = SourcePath.replace("home", "");
    const sourceURL = sourcePath.replace(/lapland-/g,"lapland");
    const sourceURLmod = sourceURL.replace("laplandholidays","lapland-holidays");
    const sourcePathmod = sourceURLmod.replace(/st\./g,"st-");
    const FullURL = HOMEpath + sourcePathmod;
    // Open the URL
    const response = await page.goto(FullURL, { waitUntil: 'domcontentloaded' });
    console.log('TEST = '+ FullURL);
    console.log('Response = '+ response.status());
    await expect(page).not.toHaveURL(ERRORpath)
    await expect(response.status()).not.toBe(404);
    await expect(response.status()).not.toBe(500);
    await expect(response.status()).not.toBe(503);
}


async function Santa_Sourcepath_Checker(page: any, SourcePath: string, HOMEpath: string, ERRORpath: string) {
    const sourcePath = SourcePath.replace("home", "");
    const sourceURL = sourcePath.replace(/lapland-/g,"lapland");
    const sourceURLmod = sourceURL.replace("laplandholidays","lapland-holidays");
    const sourcePathmod = sourceURLmod.replace(/st\./g,"st-");
    const FullURL = HOMEpath + sourcePathmod;
    // Open the URL
    const response = await page.goto(FullURL, { waitUntil: 'domcontentloaded' });
    console.log('TEST = '+ FullURL);
    console.log('Response = '+ response.status());
    await expect(page).not.toHaveURL(ERRORpath)
    await expect(response.status()).not.toBe(404);
    await expect(response.status()).not.toBe(500);
    await expect(response.status()).not.toBe(503);
}


async function Ski_Sourcepath_Checker(page: any, SourcePath: string, HOMEpath: string, ERRORpath: string) {
    const sourcePath = SourcePath.replace("home", "");
    const sourceURL = sourcePath.replace("ski-resorts","resorts");
    const sourcePathmod = sourceURL.replace(/st\./g,"st-");
    const FullURL = HOMEpath + sourcePathmod;
    // Open the URL
    const response = await page.goto(FullURL, { waitUntil: 'domcontentloaded' });
    console.log('TEST = '+ FullURL);
    console.log('Response = '+ response.status());
    await expect(page).not.toHaveURL(ERRORpath)
    await expect(response.status()).not.toBe(404);
    await expect(response.status()).not.toBe(500);
    await expect(response.status()).not.toBe(503);
}


async function Walking_Sourcepath_Checker(page: any, SourcePath: string, HOMEpath: string, ERRORpath: string) {
    const sourcePath = SourcePath.replace("home", "/walking-holidays");
    const sourcePathmod = sourcePath.replace(/st\./g,"st-");
    const FullURL = HOMEpath + sourcePathmod;
    // Open the URL
    const response = await page.goto(FullURL, { waitUntil: 'domcontentloaded' });
    console.log('TEST = '+ FullURL);
    console.log('Response = '+ response.status());
    await expect(page).not.toHaveURL(ERRORpath)
    await expect(response.status()).not.toBe(404);
    await expect(response.status()).not.toBe(500);
    await expect(response.status()).not.toBe(503);
}


async function Lapland_URL_Builder(HOMEpath: string, SourcePath: string ) {
    const sourcePath = SourcePath.replace("home", "");
    const sourceURL = sourcePath.replace(/lapland-/g,"lapland");
    const sourceURLmod = sourceURL.replace("laplandholidays","lapland-holidays");
    const sourcePathmod = sourceURLmod.replace(/st\./g,"st-");
    const FullURL = HOMEpath + sourcePathmod;
    return FullURL;
}


async function Santa_URL_Builder(HOMEpath: string, SourcePath: string ) {
    const sourcePath = SourcePath.replace("home", "");
    const sourceURL = sourcePath.replace(/lapland-/g,"lapland");
    const sourceURLmod = sourceURL.replace("laplandholidays","lapland-holidays");
    const sourcePathmod = sourceURLmod.replace(/st\./g,"st-");
    const FullURL = HOMEpath + sourcePathmod;
    return FullURL;
}


async function Ski_URL_Builder(HOMEpath: string, SourcePath: string) {
    const sourcePath = SourcePath.replace("home", "");
    const sourceURL = sourcePath.replace("ski-resorts","resorts");
    const sourcePathmod = sourceURL.replace(/st\./g,"st-");
    const FullURL = HOMEpath + sourcePathmod;
    return FullURL;
}


async function Walking_URL_Builder(HOMEpath: string, SourcePath: string) {
    const sourcePath = SourcePath.replace("home", "/walking-holidays");
    const sourcePathmod = sourcePath.replace(/st\./g,"st-");
    const FullURL = HOMEpath + sourcePathmod;
    return FullURL;
}




export const ECMS = {
    Lapland_Sourcepath_Checker,
    Santa_Sourcepath_Checker,
    Ski_Sourcepath_Checker,
    Walking_Sourcepath_Checker,
    Lapland_URL_Builder,
    Santa_URL_Builder,
    Ski_URL_Builder,
    Walking_URL_Builder
};