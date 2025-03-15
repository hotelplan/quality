import { test, expect } from '../../../resources/explore_resources/fixtures/page_fixtures';
import environmentBaseUrl from '../../../resources/utils/environmentBaseUrl';
import {parse} from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';


const env = process.env.ENV || "qa";
const enGBurl = environmentBaseUrl[env].en_gb;
const search_datacsv = parse(fs.readFileSync(path.join(__dirname, '../data', 'searchdata.csv')),
    {columns: true, skip_empty_lines: true}
);

test.beforeEach(async ({ page}) => {
    await page.goto(enGBurl);
});
test.afterEach(async ({ page }) => {
    await page.close();
});
test.describe(`Search without filters`, () => {
    test(`Search all via homepage`, async ({ page, tripsearch}) => {
        await tripsearch.searchFunction();
    });
    test(`Search all via trip search modal`, async ({ page, homesearch}) => {
        await homesearch.searchFunction();
    });
});
for (const {query_type, destination, trip_type, monthyear} of search_datacsv) {
    test.describe(`Homepage Filter: ${query_type}`, () => {
        test(`Search and verify filters on Homepage for (${destination}, ${trip_type}, ${monthyear})`, async ({ page, homesearch }) => {
            await homesearch.randomSearch(query_type, destination, trip_type, monthyear);
        });
    });

    test.describe(`Trip Search Modal: ${query_type}`, () => {
        test(`Search and verify filters on Trip Search for (${destination}, ${trip_type}, ${monthyear})`, async ({ page, tripsearch }) => {
            await tripsearch.tripsearchModal(query_type, destination, trip_type, monthyear);
        });
    });
}
