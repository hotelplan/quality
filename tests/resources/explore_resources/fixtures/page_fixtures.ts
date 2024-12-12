import { test as base } from '@playwright/test';
import { Homepage } from '../page_objects/en_gb/homepage_filter';
import { TripSearchModal } from '../page_objects/en_gb/hometrip_search';

type pages = {
    homesearch: Homepage,
    tripsearch: TripSearchModal
}

const testPages = base.extend<pages>({
    
    homesearch: async ({page},use) => {
        await use(new Homepage(page));
    },
    tripsearch: async ({page},use) => {
        await use(new TripSearchModal(page));
    },
});

export const test = testPages;
export const expect = testPages.expect;