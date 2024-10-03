import { test as base } from '@playwright/test';
import { EcmsSignInPage }  from '../page_objects/e_cms_pages/e_cms_sign_in_page';
import { EcmsMainPage } from '../page_objects/e_cms_pages/e_cms_main_page';
import { CountryPage } from '../page_objects/country_page';


type pages = {
    ecmsSignInpage: EcmsSignInPage,
    ecmsMainPage: EcmsMainPage,
    countryPage: CountryPage
}


const testPages = base.extend<pages>({
    
    ecmsSignInpage: async ({page},use) => {
        await use(new EcmsSignInPage(page));
    },

    ecmsMainPage: async ({page},use) => {
        await use(new EcmsMainPage(page));
    },

    countryPage: async ({page},use) => {
        await use(new CountryPage(page));
    }


})

export const test = testPages;
export const expect = testPages.expect;