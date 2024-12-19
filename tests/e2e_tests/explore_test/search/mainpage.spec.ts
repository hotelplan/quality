import { test, expect } from '../../../resources/explore_resources/fixtures/page_fixtures';
import environmentBaseUrl from '../../../resources/utils/environmentBaseUrl';
import {parse} from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';


const env = process.env.ENV || "qa";
const enGBurl = environmentBaseUrl[env].en_gb;
const search_datacsv = parse(
    fs.readFileSync(path.join(__dirname, '../data', 'link_filters.csv')),
    {columns: true, skip_empty_lines: true}
);

test.beforeEach(async ({ page}) => {
    await page.goto(enGBurl);
});
test.afterEach(async ({ page }) => {
    await page.close();
});
for (const {active, link_type, secondary_link, filtersearch, primary_link, expected_url} of search_datacsv) {
    test.describe(`Header links`, () => {
        test(`Go to (${link_type} > ${primary_link} > ${secondary_link})`, async ({ page, headerlink }) => {
            const url = enGBurl + expected_url;
            await headerlink.headerLink(active,filtersearch,link_type,primary_link,secondary_link,url);
        });
    });
}
