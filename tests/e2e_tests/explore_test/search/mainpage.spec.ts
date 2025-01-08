import { test, expect } from '../../../resources/explore_resources/fixtures/page_fixtures';
import environmentBaseUrl from '../../../resources/utils/environmentBaseUrl';
import {parse} from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';


const env = process.env.ENV || "qa";
const enGBurl = environmentBaseUrl[env].en_gb;
const search_datacsv = parse(fs.readFileSync(path.join(__dirname, '../data', 'link_filters.csv')),
    {columns: true, skip_empty_lines: true}
);
const filter_destinations = search_datacsv.filter(row => row['link_type'].includes('Destinations'));
const filter_experiences = search_datacsv.filter(row => row['link_type'].includes('Experiences'));
const filter_about = search_datacsv.filter(row => row['link_type'].includes('About'));
const filter_footer = search_datacsv.filter(row => row['link_type'].includes('Footer'));

test.beforeEach(async ({ page}) => {
    await page.goto(enGBurl);
});
test.afterEach(async ({ page }) => {
    await page.close();
});
for (const {active, link_type, secondary_link, filtersearch, primary_link, expected_url} of filter_destinations) {
    test.describe(`Header > Destinations links > ${primary_link}`, () => {
        test(`Go to (${link_type} > ${primary_link} > ${secondary_link})`, async ({ page, headerlink }) => {
            const url = enGBurl + expected_url;
            await headerlink.headerLink(active,filtersearch,link_type,primary_link,secondary_link,url);
            await headerlink.destinationlink_checker(link_type,primary_link,secondary_link);
        });
    });
}
for (const {active, link_type, secondary_link, filtersearch, primary_link, expected_url} of filter_experiences) {
    test.describe(`Header > Experiences links > ${primary_link}`, () => {
        test(`Go to (${link_type} > ${primary_link} > ${secondary_link})`, async ({ page, headerlink }) => {
            const url = enGBurl + expected_url;
            await headerlink.headerLink(active,filtersearch,link_type,primary_link,secondary_link,url);
        });
    });
}
for (const {active, link_type, secondary_link, filtersearch, primary_link, expected_url} of filter_about) {
    test.describe(`Header > About links > ${primary_link}`, () => {
        test(`Go to (${link_type} > ${primary_link} > ${secondary_link})`, async ({ page, headerlink }) => {
            const url = enGBurl + expected_url;
            await headerlink.headerLink(active,filtersearch,link_type,primary_link,secondary_link,url);
        });
    });
}
for (const {link_type, primary_link, expected_url} of filter_footer) {
    test.describe(`Footer links`, () => {
        test(`Go to (${link_type} > ${primary_link})`, async ({ page, headerlink }) => {
            const url = enGBurl + expected_url;
            await headerlink.footerLink(primary_link);
        });
    });
}