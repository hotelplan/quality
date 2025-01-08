import { test as base } from '@playwright/test';
import { Homepage } from '../page_objects/en_gb/homepage_filter';
import { TripSearchModal } from '../page_objects/en_gb/hometrip_search';
import { Linkpage } from '../page_objects/en_gb/linkpages';
import Footerpage from '../page_objects/en_gb/footer';

type pages = {
    homesearch: Homepage,
    tripsearch: TripSearchModal,
    headerlink: Linkpage,
    footerlink: Footerpage
}

const testPages = base.extend<pages>({
    
    homesearch: async ({page},use) => {
        await use(new Homepage(page));
    },
    tripsearch: async ({page},use) => {
        await use(new TripSearchModal(page));
    },
    headerlink: async ({page},use) => {
        await use(new Linkpage(page));
    },
    footerlink: async ({page},use) => {
        await use(new Footerpage(page));
    },
});

export const test = testPages;
export const expect = testPages.expect;