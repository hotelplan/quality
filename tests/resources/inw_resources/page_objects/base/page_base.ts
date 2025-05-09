import { test as base, request, APIRequestContext } from '@playwright/test';
import { EcmsSignInPage }  from '../e_cms_pages/e_cms_sign_in_page';
import { EcmsMainPage } from '../e_cms_pages/e_cms_main_page';
import { PcmsSignInPage }  from '../p_cms_pages/p_cms_sign_in_page';
import { PcmsMainPage } from '../p_cms_pages/p_cms_main_page';
import { CountryPage } from '../country_page';
import { RegionPage } from '../region_page';
import { ResortPage } from '../resort_page';
import { SearchResultPage } from '../search_result_page'
import { HeadlineComponent } from '../component/headline';
import { AccordionComponent } from '../component/accordion';
import { CTAButtonComponent } from '../component/ctaButton';
import { RTEComponent } from '../component/richTextEditor';
import { SharedSteps } from '../../utilities/sharedSteps';



type pages = {
    ecmsSignInpage: EcmsSignInPage,
    ecmsMainPage: EcmsMainPage,
    pcmsSignInpage: PcmsSignInPage,
    pcmsMainPage: PcmsMainPage,
    countryPage: CountryPage,
    regionPage: RegionPage,
    resortPage: ResortPage,
    searchResultPage: SearchResultPage
    headlineComponent: HeadlineComponent
    accordionComponent: AccordionComponent
    ctaButtonComponent: CTAButtonComponent
    rteComponent: RTEComponent
    sharedSteps: SharedSteps
}

let apiContext: APIRequestContext;

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
    searchResultPage: async ({page},use) => {
        apiContext = await request.newContext();
        await use(new SearchResultPage(page, apiContext));
    },
    resortPage: async ({page},use) => {
        apiContext = await request.newContext();
        await use(new ResortPage(page, apiContext));
    },
    headlineComponent: async ({page},use) => {
        await use(new HeadlineComponent(page));
    },
    accordionComponent: async ({page},use) => {
        await use(new AccordionComponent(page));
    },
    ctaButtonComponent: async ({page},use) => {
        await use(new CTAButtonComponent(page));
    },
    rteComponent: async ({page},use) => {
        await use(new RTEComponent(page));
    },
    sharedSteps: async ({page},use) => {
        await use(new SharedSteps(page));
    },


})

export const test = testPages;
export const expect = testPages.expect;