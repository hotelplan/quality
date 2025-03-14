import { test as base } from '@playwright/test';
import { EcmsSignInPage }  from '../e_cms_pages/e_cms_sign_in_page';
import { EcmsMainPage } from '../e_cms_pages/e_cms_main_page';
import { PcmsSignInPage }  from '../p_cms_pages/p_cms_sign_in_page';
import { PcmsMainPage } from '../p_cms_pages/p_cms_main_page';
import { CountryPage } from '../country_page';
import { RegionPage } from '../region_page';


type pages = {
    ecmsSignInpage: EcmsSignInPage,
    ecmsMainPage: EcmsMainPage,
    pcmsSignInpage: PcmsSignInPage,
    pcmsMainPage: PcmsMainPage,
    countryPage: CountryPage,
    regionPage: RegionPage
}


const testPages = base.extend<pages>({
    
    ecmsSignInpage: async ({page},use) => {
        await use(new EcmsSignInPage(page));
    },

    ecmsMainPage: async ({page},use) => {
        await use(new EcmsMainPage(page));
    },

    pcmsSignInpage: async ({page},use) => {
        await use(new PcmsSignInPage(page));
    },

    pcmsMainPage: async ({page},use) => {
        await use(new PcmsMainPage(page));
    },

    countryPage: async ({page},use) => {
        await use(new CountryPage(page));
    },

    regionPage: async ({page},use) => {
        await use(new RegionPage(page));
    },


})

export const test = testPages;
export const expect = testPages.expect;