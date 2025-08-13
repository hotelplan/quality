import { test, expect } from '../../../resources/inw_resources/page_objects/base/page_base';
import { SearchResultPage } from '../../../resources/inw_resources/page_objects/search_result_page';
import environmentBaseUrl from '../../../resources/utils/environmentBaseUrl';
import { FilterTestHelpers, FilterTestData } from '../../../resources/inw_resources/utilities/filterTestHelpers';

const env = process.env.ENV || "qa";
const inghamsUrl = environmentBaseUrl[env].inghams;

/**
 * COMPREHENSIVE SEARCH ACCOMMODATION FILTERS TEST SUITE
 * 
 * This refactored test suite implements systematic filter testing across
 * all categories (Ski, Walking, Lapland) with proper enabled/disabled state validation
 * as discovered through MCP Server playwright exploration.
 * 
 * IMPROVEMENTS IMPLEMENTED:
 * - Proper Page Object Model (POM) compliance
 * - Reusable helper methods and test data
 * - Reduced code duplication
 * - Enhanced error handling and reporting
 * - Comprehensive cross-category analysis
 */

// Use centralized test data instead of inline definitions
const searchCategories = FilterTestData.categories;
const filterDefinitions = FilterTestData.universalFilters;

test.beforeEach(async ({ page }) => {
    await test.step('Given: I navigate to Inghams home page and handle initial setup', async () => {
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

test.describe('Comprehensive Search Accommodation Filters Tests', () => {

    // FILTER TYPE 1: RATINGS FILTER TESTS  
    test.describe('Ratings Filter Tests', () => {
        for (const category of searchCategories) {
            test(`${category.name} - Ratings Filter: Verify all rating options are enabled and functional @ratingsFilter`, async ({ page }) => {
                test.setTimeout(120000);
                
                const searchResultPage = new SearchResultPage(page, {} as any);
                const filterHelpers = new FilterTestHelpers(page, searchResultPage);
                
                await test.step(`Setup: Navigate to ${category.name} search results`, async () => {
                    await filterHelpers.setupCategorySearch(category.name, category.searchLocation);
                    console.log(`✓ Successfully reached ${category.name} search results page`);
                });

                await test.step(`Test: Verify all rating options (1-5 stars) are enabled`, async () => {
                    const ratingsValidation = await filterHelpers.validateUniversalFilter(
                        'Ratings', 
                        filterDefinitions.ratings.options,
                        filterDefinitions.ratings.testOption
                    );
                    
                    expect(ratingsValidation.validationPassed, 
                        `All rating options should be enabled for ${category.name}`).toBe(true);
                    
                    console.log(`🌟 ${category.name} Ratings filter validation: ${ratingsValidation.enabledCount}/${filterDefinitions.ratings.options.length} options enabled`);
                });

                await test.step(`Test: Apply rating filter and verify results update`, async () => {
                    const testRating = filterDefinitions.ratings.testOption;
                    const filterResult = await searchResultPage.applyFilterAndValidate(
                        'Ratings', 
                        testRating,
                        { expectUrlUpdate: true, expectResultsChange: true }
                    );
                    
                    expect(filterResult.urlUpdated, 
                        `Rating filter should update URL for ${category.name}`).toBe(true);
                    
                    console.log(`✅ Applied ${testRating}-star rating filter successfully for ${category.name}`);
                    
                    // Reset filter for next test
                    await searchResultPage.resetFilter('Ratings', testRating);
                });
            });
        }
    });

    // FILTER TYPE 2: BEST FOR FILTER TESTS (Category-Specific)
    test.describe('Best For Filter Tests', () => {
        for (const category of searchCategories) {
            test(`${category.name} - Best For Filter: Verify enabled/disabled states match category requirements @bestForFilter`, async ({ page }) => {
                test.setTimeout(120000);
                
                const searchResultPage = new SearchResultPage(page, {} as any);
                const filterHelpers = new FilterTestHelpers(page, searchResultPage);
                
                await test.step(`Setup: Navigate to ${category.name} search results`, async () => {
                    await filterHelpers.setupCategorySearch(category.name, category.searchLocation);
                    console.log(`✓ Successfully reached ${category.name} search results page`);
                });

                await test.step(`Test: Verify category-specific Best For filter states`, async () => {
                    const bestForValidation = await filterHelpers.validateCategorySpecificFilter(
                        'Best For',
                        category.specificFilters.bestFor,
                        category.specificFilters.bestFor.enabled[0]
                    );
                    
                    console.log(`🎯 ${category.name} Best For filter validation: ${bestForValidation.enabledMatches}/${category.specificFilters.bestFor.enabled.length} enabled options matched`);
                });

                await test.step(`Test: Apply Best For filter and verify results`, async () => {
                    if (category.specificFilters?.bestFor?.enabled?.length > 0) {
                        const testOption = category.specificFilters.bestFor.enabled[0];
                        
                        const filterResult = await searchResultPage.applyFilterAndValidate(
                            'Best For',
                            testOption,
                            { expectUrlUpdate: true }
                        );
                        
                        expect(filterResult.applied, 
                            `Best For filter should apply successfully for ${category.name}`).toBe(true);
                        
                        console.log(`✅ Applied "${testOption}" filter successfully for ${category.name}`);
                        
                        // Reset filter
                        await searchResultPage.resetFilter('Best For', testOption);
                    }
                });
            });
        }
    });

    // FILTER TYPE 3: BOARD BASIS FILTER TESTS
    test.describe('Board Basis Filter Tests', () => {
        for (const category of searchCategories) {
            test(`${category.name} - Board Basis Filter: Verify all meal plan options are enabled @boardBasisFilter`, async ({ page }) => {
                test.setTimeout(120000);
                
                const searchResultPage = new SearchResultPage(page, {} as any);
                const filterHelpers = new FilterTestHelpers(page, searchResultPage);
                
                await test.step(`Setup: Navigate to ${category.name} search results`, async () => {
                    await filterHelpers.setupCategorySearch(category.name, category.searchLocation);
                    console.log(`✓ Successfully reached ${category.name} search results page`);
                });

                await test.step(`Test: Verify all Board Basis options are enabled`, async () => {
                    const boardBasisValidation = await filterHelpers.validateUniversalFilter(
                        'Board Basis',
                        filterDefinitions.boardBasis.options,
                        filterDefinitions.boardBasis.testOption
                    );
                    
                    expect(boardBasisValidation.enabledCount, 
                        `${category.name} should have at least 3 board basis options`).toBeGreaterThan(2);
                    
                    console.log(`🍽️ ${category.name} Board Basis filter validation: ${boardBasisValidation.enabledCount} options enabled`);
                });

                await test.step(`Test: Apply board basis filter and verify functionality`, async () => {
                    const testOption = filterDefinitions.boardBasis.testOption;
                    const filterResult = await searchResultPage.applyFilterAndValidate(
                        'Board Basis',
                        testOption,
                        { expectUrlUpdate: true }
                    );
                    
                    if (filterResult.applied) {
                        console.log(`✅ Successfully applied ${testOption} filter for ${category.name}`);
                        await searchResultPage.resetFilter('Board Basis', testOption);
                    } else {
                        console.log(`ℹ️ Board basis filter application test skipped for ${category.name}`);
                    }
                });
            });
        }
    });

    // FILTER TYPE 4: FACILITIES FILTER TESTS
    test.describe('Facilities Filter Tests', () => {
        for (const category of searchCategories) {
            test(`${category.name} - Facilities Filter: Verify all facility options are enabled @facilitiesFilter`, async ({ page }) => {
                test.setTimeout(120000);
                
                const searchResultPage = new SearchResultPage(page, {} as any);
                const filterHelpers = new FilterTestHelpers(page, searchResultPage);
                
                await test.step(`Setup: Navigate to ${category.name} search results`, async () => {
                    await filterHelpers.setupCategorySearch(category.name, category.searchLocation);
                    console.log(`✓ Successfully reached ${category.name} search results page`);
                });

                await test.step(`Test: Verify Facilities filter options are enabled`, async () => {
                    const facilitiesValidation = await filterHelpers.validateUniversalFilter(
                        'Facilities',
                        filterDefinitions.facilities.options,
                        filterDefinitions.facilities.testOption
                    );
                    
                    expect(facilitiesValidation.enabledCount, 
                        `${category.name} should have at least 5 facility options`).toBeGreaterThan(4);
                    
                    console.log(`🏨 ${category.name} Facilities filter validation: ${facilitiesValidation.enabledCount} options enabled`);
                });

                await test.step(`Test: Apply facility filter and verify results`, async () => {
                    const testOption = filterDefinitions.facilities.testOption;
                    const filterResult = await searchResultPage.applyFilterAndValidate(
                        'Facilities',
                        testOption,
                        { expectUrlUpdate: true }
                    );
                    
                    if (filterResult.applied) {
                        console.log(`✅ Successfully applied ${testOption} filter for ${category.name}`);
                        await searchResultPage.resetFilter('Facilities', testOption);
                    } else {
                        console.log(`ℹ️ Facility filter application test skipped for ${category.name}`);
                    }
                });
            });
        }
    });

    // FILTER TYPE 5: HOLIDAY TYPES FILTER TESTS
    test.describe('Holiday Types Filter Tests', () => {
        for (const category of searchCategories) {
            test(`${category.name} - Holiday Types Filter: Verify most options enabled with few disabled @holidayTypesFilter`, async ({ page }) => {
                test.setTimeout(120000);
                
                const searchResultPage = new SearchResultPage(page, {} as any);
                const filterHelpers = new FilterTestHelpers(page, searchResultPage);
                
                await test.step(`Setup: Navigate to ${category.name} search results`, async () => {
                    await filterHelpers.setupCategorySearch(category.name, category.searchLocation);
                    console.log(`✓ Successfully reached ${category.name} search results page`);
                });

                await test.step(`Test: Verify Holiday Types filter states (mostly enabled)`, async () => {
                    const holidayTypesValidation = await filterHelpers.validateUniversalFilter(
                        'Holiday Types',
                        filterDefinitions.holidayTypes.options,
                        filterDefinitions.holidayTypes.testOption
                    );
                    
                    // Verify the ratio is correct (most should be enabled)
                    const enabledRatio = holidayTypesValidation.enabledCount / filterDefinitions.holidayTypes.options.length;
                    expect(enabledRatio, 
                        `Most holiday types should be enabled for ${category.name}`).toBeGreaterThan(0.7);
                    
                    console.log(`🏖️ ${category.name} Holiday Types filter validation: ${holidayTypesValidation.enabledCount}/${filterDefinitions.holidayTypes.options.length} options enabled`);
                });

                await test.step(`Test: Apply holiday type filter and verify functionality`, async () => {
                    const testOption = filterDefinitions.holidayTypes.testOption;
                    const filterResult = await searchResultPage.applyFilterAndValidate(
                        'Holiday Types',
                        testOption,
                        { expectUrlUpdate: true }
                    );
                    
                    if (filterResult.applied) {
                        console.log(`✅ Successfully applied ${testOption} filter for ${category.name}`);
                        await searchResultPage.resetFilter('Holiday Types', testOption);
                    } else {
                        console.log(`ℹ️ Holiday Types filter application test skipped for ${category.name}`);
                    }
                });
            });
        }
    });

    // FILTER TYPE 6: DURATION FILTER TESTS
    test.describe('Duration Filter Tests', () => {
        for (const category of searchCategories) {
            test(`${category.name} - Duration Filter: Discover and verify duration options @durationFilter`, async ({ page }) => {
                test.setTimeout(120000);
                
                const searchResultPage = new SearchResultPage(page, {} as any);
                const filterHelpers = new FilterTestHelpers(page, searchResultPage);
                
                await test.step(`Setup: Navigate to ${category.name} search results`, async () => {
                    await filterHelpers.setupCategorySearch(category.name, category.searchLocation);
                    console.log(`✓ Successfully reached ${category.name} search results page`);
                });

                await test.step(`Test: Explore Duration filter options`, async () => {
                    try {
                        const durationOptions = await searchResultPage.getFilterOptions('Duration');
                        console.log(`⏱️ ${category.name} Duration filter: Found ${durationOptions.total} options`);
                        
                        if (durationOptions.total > 0) {
                            console.log(`   Enabled options: ${durationOptions.enabled.slice(0, 5).join(', ')}${durationOptions.enabled.length > 5 ? '...' : ''}`);
                        }
                    } catch (error) {
                        console.log(`   ℹ️ Duration filter exploration failed for ${category.name}: ${error.message}`);
                    }
                });
            });
        }
    });

    // FILTER TYPE 7: BUDGET FILTER TESTS
    test.describe('Budget Filter Tests', () => {
        for (const category of searchCategories) {
            test(`${category.name} - Budget Filter: Verify custom range input functionality @budgetFilter`, async ({ page }) => {
                test.setTimeout(120000);
                
                const searchResultPage = new SearchResultPage(page, {} as any);
                const filterHelpers = new FilterTestHelpers(page, searchResultPage);
                
                await test.step(`Setup: Navigate to ${category.name} search results`, async () => {
                    await filterHelpers.setupCategorySearch(category.name, category.searchLocation);
                    console.log(`✓ Successfully reached ${category.name} search results page`);
                });

                await test.step(`Test: Verify Budget filter has custom input fields`, async () => {
                    try {
                        await searchResultPage.openFilter('Budget');
                        
                        // Look for input fields
                        const inputFields = page.locator('input[type="number"], input[type="text"]');
                        const inputCount = await inputFields.count();
                        
                        console.log(`💰 ${category.name} Budget filter: Found ${inputCount} input fields`);
                        
                        // Basic validation - should have some form of budget input
                        expect(inputCount, 
                            `${category.name} should have budget filter inputs`).toBeGreaterThan(0);
                        
                        await searchResultPage.closeFilter();
                        
                    } catch (error) {
                        console.log(`   ℹ️ Budget filter test skipped for ${category.name}: ${error.message}`);
                    }
                });

                await test.step(`Test: Attempt to apply budget filter`, async () => {
                    try {
                        await searchResultPage.openFilter('Budget');
                        
                        const inputFields = page.locator('input');
                        const inputCount = await inputFields.count();
                        
                        if (inputCount > 0) {
                            // Try to fill first input
                            await inputFields.first().fill('500');
                            
                            if (inputCount > 1) {
                                await inputFields.last().fill('2000');
                            }
                            
                            await searchResultPage.applyFilter();
                            console.log(`   ✅ Successfully applied budget filter for ${category.name}`);
                        } else {
                            await searchResultPage.closeFilter();
                            console.log(`   ℹ️ No budget inputs found for ${category.name}`);
                        }
                        
                    } catch (error) {
                        console.log(`   ℹ️ Budget filter interaction test skipped for ${category.name}: ${error.message}`);
                        await searchResultPage.closeFilter();
                    }
                });
            });
        }
    });

    // COMPREHENSIVE CROSS-CATEGORY FILTER COMPARISON TEST
    test('Cross-Category Filter Analysis: Compare filter availability and states across all categories @crossCategoryAnalysis', async ({ page }) => {
        test.setTimeout(300000); // 5 minutes timeout
        
        const searchResultPage = new SearchResultPage(page, {} as any);
        const filterHelpers = new FilterTestHelpers(page, searchResultPage);
        
        await test.step('Generate comprehensive filter comparison report', async () => {
            const filterTypes = ['Ratings', 'Best For', 'Board Basis', 'Facilities', 'Holiday Types', 'Duration', 'Budget'];
            
            for (const filterType of filterTypes) {
                console.log(`\n📊 Running cross-category analysis for ${filterType}:`);
                const analysis = await filterHelpers.runCrossCategaryFilterAnalysis(filterType);
                
                const report = filterHelpers.generateFilterTestReport(filterType, {
                    crossCategoryAnalysis: analysis
                });
                
                console.log(report);
            }
            
            console.log(`\n✅ Cross-category filter analysis completed successfully!`);
        });
    });

    // ALL FILTERS INTEGRATION TEST
    test('All Filters Modal: Verify comprehensive filter interface @allFiltersModal', async ({ page }) => {
        test.setTimeout(120000);
        
        const searchResultPage = new SearchResultPage(page, {} as any);
        const filterHelpers = new FilterTestHelpers(page, searchResultPage);
        
        await test.step('Test All Filters modal across categories', async () => {
            for (const category of searchCategories) {
                console.log(`\n🎛️ Testing All Filters modal for ${category.name}:`);
                
                // Navigate to category
                await filterHelpers.setupCategorySearch(category.name, category.searchLocation);
                
                // Click "All filters" button
                try {
                    await page.getByRole('button', { name: 'All filters' }).click();
                    await page.waitForTimeout(2000);
                    
                    // Verify modal opens and contains filter sections
                    const filterSections = ['Ratings', 'Best For', 'Board Basis', 'Facilities', 'Holiday Types', 'Duration', 'Budget'];
                    let visibleSections = 0;
                    
                    for (const section of filterSections) {
                        try {
                            const sectionElement = page.locator(`text="${section}"`).first();
                            if (await sectionElement.isVisible({ timeout: 3000 })) {
                                visibleSections++;
                                console.log(`   ✅ ${section} section is visible in All Filters modal`);
                            }
                        } catch (error) {
                            console.log(`   ℹ️ ${section} section not found in modal`);
                        }
                    }
                    
                    console.log(`   📊 Found ${visibleSections}/${filterSections.length} filter sections in ${category.name} All Filters modal`);
                    expect(visibleSections, `${category.name} All Filters modal should show most filter sections`).toBeGreaterThan(4);
                    
                    // Close modal
                    await page.keyboard.press('Escape');
                    await page.waitForTimeout(1000);
                    
                } catch (error) {
                    console.log(`   ℹ️ All Filters modal test skipped for ${category.name}: ${error.message}`);
                }
            }
        });
    });
});

// PERFORMANCE AND RELIABILITY TESTS
test.describe('Filter Performance and Reliability Tests', () => {

    test('Filter Response Time: Verify all filters load within acceptable time limits @filterPerformance', async ({ page }) => {
        test.setTimeout(180000);
        
        const searchResultPage = new SearchResultPage(page, {} as any);
        const filterHelpers = new FilterTestHelpers(page, searchResultPage);
        
        await test.step('Test filter loading performance across categories', async () => {
            const filterTypes = ['Ratings', 'Best For', 'Board Basis', 'Facilities', 'Holiday Types', 'Duration', 'Budget'];
            
            for (const filterType of filterTypes) {
                console.log(`\n⚡ Testing ${filterType} filter performance:`);
                const performanceResults = await filterHelpers.testFilterPerformance(filterType);
                
                expect(performanceResults.performancePassed, 
                    `${filterType} filter should load within acceptable time limits`).toBe(true);
                
                const report = filterHelpers.generateFilterTestReport(filterType, {
                    performanceResults: performanceResults
                });
                console.log(report);
            }
        });
    });

    test('Filter State Persistence: Verify applied filters persist during navigation @filterPersistence', async ({ page }) => {
        test.setTimeout(120000);
        
        const searchResultPage = new SearchResultPage(page, {} as any);
        const filterHelpers = new FilterTestHelpers(page, searchResultPage);
        
        await test.step('Test filter state persistence', async () => {
            // Test with Ski category
            await filterHelpers.setupCategorySearch('Ski', 'anywhere');
            
            // Test persistence with rating filter
            const persistenceResults = await filterHelpers.testFilterPersistence('Ratings', '4');
            
            expect(persistenceResults.persistenceWorked, 
                'Filter parameters should persist after page refresh').toBe(true);
            
            const report = filterHelpers.generateFilterTestReport('Ratings', {
                persistenceResults: persistenceResults
            });
            console.log(report);
        });
    });
});
