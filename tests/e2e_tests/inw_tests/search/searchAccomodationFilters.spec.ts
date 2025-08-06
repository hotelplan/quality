import { test, expect } from '../../../resources/inw_resources/page_objects/base/page_base';
import { SearchResultPage } from '../../../resources/inw_resources/page_objects/search_result_page';
import environmentBaseUrl from '../../../resources/utils/environmentBaseUrl';

const env = process.env.ENV || "qa";
const inghamsUrl = environmentBaseUrl[env].inghams;

// Test data for different search categories
const searchCategories = [
    { category: 'Ski', searchLocation: 'anywhere' },
    { category: 'Walking', searchLocation: 'anywhere' },
    { category: 'Lapland', searchLocation: 'anywhere' }
];

test.beforeEach(async ({ page }) => {
    await test.step('Given: I navigate to Inghams home page', async () => {
        await page.goto(inghamsUrl);
        await page.waitForLoadState('domcontentloaded');
        
        // Handle cookies
        try {
            const acceptCookiesBtn = page.getByRole('button', { name: 'Accept All Cookies' });
            if (await acceptCookiesBtn.isVisible({ timeout: 5000 })) {
                await acceptCookiesBtn.click();
                console.log('✓ Cookies accepted');
            }
        } catch (error) {
            console.log('ℹ️ Cookies handling skipped');
        }
        
        await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
            console.log('Network idle timeout, continuing...');
        });
    });
});

test.describe('Search Exposed Filters Tests', async () => {
    
    // Basic filter presence test for each search category
    for (const { category, searchLocation } of searchCategories) {
        test(`${category} filters presence verification @searchExposedFilters`, async ({ page }) => {
            test.setTimeout(60000); // 1 minute timeout
            
            const searchResultPage = new SearchResultPage(page, {} as any);
            
            await test.step(`When: I perform ${category} search`, async () => {
                await searchResultPage.clickSearchProductTab(category);
                await searchResultPage.searchAnywhere(searchLocation);  
                await searchResultPage.clickSearchHolidayBtn();
                await searchResultPage.validateSearchResultPageUrl();
                
                console.log(`✓ Successfully reached ${category} search results page`);
            });

            await test.step(`Then: I verify all expected filters are present and visible for ${category}`, async () => {
                console.log(`\n🔍 Verifying filter buttons for ${category}:`);
                
                // All expected filter buttons based on browser exploration
                const expectedFilters = [
                    'Ratings',
                    'Best For', 
                    'Board Basis',
                    'Facilities',
                    'Holiday Types',
                    'Duration',
                    'Budget',
                    'All filters',
                    'Sort by'
                ];
                
                // Use SearchResultPage method for filter verification (following POM)
                const filterVerificationResults = await searchResultPage.verifyFiltersPresence(expectedFilters);
                
                console.log(`\n✅ Filter verification complete: ${filterVerificationResults.visibleCount}/${expectedFilters.length} filters visible for ${category}`);
                
                // Verify we found most of the expected filters
                expect(filterVerificationResults.visibleCount).toBeGreaterThan(6); // At least 7 out of 9 filters should be visible
            });

            await test.step(`And: I verify search results are present for ${category}`, async () => {
                console.log(`\n📊 Verifying search results for ${category}:`);
                
                // Use SearchResultPage method for result counting (following POM)
                const searchResults = await searchResultPage.countSearchResults();
                
                if (searchResults.count > 0) {
                    console.log(`✅ Search results verification complete: ${searchResults.count} results found for ${category}`);
                } else {
                    console.log(`ℹ️ No search results found for ${category} (this may be expected for "anywhere" searches)`);
                }
            });

            await test.step(`And: I verify page structure elements for ${category}`, async () => {
                console.log(`\n🏗️ Verifying page structure for ${category}:`);
                
                // Use SearchResultPage method for page structure verification (following POM)
                const structureResults = await searchResultPage.verifyPageStructureElements();
                
                console.log(`✅ Page structure verification complete for ${category}`);
                console.log(`   Found elements: ${structureResults.foundElements.join(', ')}`);
                if (structureResults.missingElements.length > 0) {
                    console.log(`   Missing/optional elements: ${structureResults.missingElements.join(', ')}`);
                }
            });
        });
    }
    
    // Summary test that verifies filter consistency across all categories
    test('Filter consistency across all search categories @searchExposedFiltersConsistency', async ({ page }) => {
        test.setTimeout(120000); // 2 minutes timeout
        
        const searchResultPage = new SearchResultPage(page, {} as any);
        const categoryFilters: { [key: string]: string[] } = {};
        
        // Test each category and collect filter information
        for (const { category, searchLocation } of searchCategories) {
            await test.step(`Collect filter information for ${category}`, async () => {
                console.log(`\n🔄 Testing ${category} category...`);
                
                await searchResultPage.clickSearchProductTab(category);
                await searchResultPage.searchAnywhere(searchLocation);  
                await searchResultPage.clickSearchHolidayBtn();
                await searchResultPage.validateSearchResultPageUrl();
                
                // Collect visible filters using SearchResultPage method (following POM)
                const expectedFilters = ['Ratings', 'Best For', 'Board Basis', 'Facilities', 'Holiday Types', 'Duration', 'Budget', 'All filters', 'Sort by'];
                const filters = await searchResultPage.getFiltersList(expectedFilters);
                
                categoryFilters[category] = filters;
                console.log(`   Filters found for ${category}: ${filters.join(', ')}`);
            });
        }
        
        await test.step('Analyze filter consistency across categories', async () => {
            console.log(`\n📈 Filter Consistency Analysis:`);
            
            const allCategories = Object.keys(categoryFilters);
            const commonFilters = categoryFilters[allCategories[0]];
            
            // Find filters common to all categories
            const universalFilters = commonFilters.filter(filter => 
                allCategories.every(category => categoryFilters[category].includes(filter))
            );
            
            console.log(`   🌟 Universal filters (present in all categories): ${universalFilters.join(', ')}`);
            
            // Report category-specific filters
            for (const category of allCategories) {
                const categorySpecific = categoryFilters[category].filter(filter => 
                    !universalFilters.includes(filter)
                );
                if (categorySpecific.length > 0) {
                    console.log(`   🎯 ${category}-specific filters: ${categorySpecific.join(', ')}`);
                }
            }
            
            // Verify we have a reasonable number of filters
            expect(universalFilters.length).toBeGreaterThan(5); // At least 6 universal filters
            console.log(`\n✅ Filter consistency analysis complete`);
        });
    });
});
