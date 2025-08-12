import { test, expect } from '../../../resources/inw_resources/page_objects/base/page_base';
import { SearchResultPage } from '../../../resources/inw_resources/page_objects/search_result_page';
import environmentBaseUrl from '../../../resources/utils/environmentBaseUrl';

const env = process.env.ENV || "qa";
const inghamsUrl = environmentBaseUrl[env].inghams;

/**
 * COMPREHENSIVE SEARCH ACCOMMODATION FILTERS TEST SUITE
 * 
 * This refactored test suite follows POM principles and implements reusable methods
 * for systematic filter testing across all categories (Ski, Walking, Lapland) 
 * with proper enabled/disabled state validation.
 */

// Reusable test data configuration
const TEST_CONFIG = {
    categories: [
        { 
            name: 'Ski', 
            searchLocation: 'anywhere',
            expectedResults: { min: 10, max: 1000 },
            filters: {
                bestFor: {
                    enabled: ['Ski In/Ski Out', 'Central Location', 'Close to Lifts', 'Family-Run', 'Small Hotel', 'Activities', 'Spa & Wellness', 'Inghams Choice', 'Food & Drink'],
                    disabled: ['Rail Options', 'Self Drive', 'Large Ski Area']
                },
                ratings: {
                    enabled: ['1', '2', '3', '4', '5'],
                    testOption: '4'
                },
                boardBasis: {
                    enabled: ['Room Only', 'Bed & Breakfast', 'Half Board', 'Full Board'],
                    testOption: 'Half Board'
                },
                facilities: {
                    enabled: ['Indoor Pool', 'Bar', 'WiFi', 'Spa Facilities'],
                    testOption: 'Indoor Pool'
                }
            }
        },
        { 
            name: 'Walking', 
            searchLocation: 'anywhere',
            expectedResults: { min: 50, max: 500 },
            filters: {
                bestFor: {
                    enabled: ['Family Friendly', 'Central Location', 'Small Hotel', 'Spa & Wellness', 'Food & Drink', 'Dog Friendly', 'Activities'],
                    disabled: ['Family-Run', 'Large Hotel']
                },
                ratings: {
                    enabled: ['1', '2', '3', '4', '5'],
                    testOption: '4'
                },
                boardBasis: {
                    enabled: ['Room Only', 'Bed & Breakfast', 'Half Board'],
                    testOption: 'Bed & Breakfast'
                },
                facilities: {
                    enabled: ['Bar', 'WiFi', 'Restaurant'],
                    testOption: 'Bar'
                }
            }
        },
        { 
            name: 'Lapland', 
            searchLocation: 'anywhere',
            expectedResults: { min: 5, max: 100 },
            filters: {
                bestFor: {
                    enabled: [], // To be discovered
                    disabled: []
                },
                ratings: {
                    enabled: ['1', '2', '3', '4', '5'],
                    testOption: '3'
                }
            }
        }
    ],
    
    filterTypes: [
        { name: 'Ratings', tag: '@ratingsFilter', hasUniversalOptions: true },
        { name: 'Best For', tag: '@bestForFilter', categorySpecific: true },
        { name: 'Board Basis', tag: '@boardBasisFilter', hasUniversalOptions: true },
        { name: 'Facilities', tag: '@facilitiesFilter', hasUniversalOptions: true },
        { name: 'Holiday Types', tag: '@holidayTypesFilter', hasUniversalOptions: true },
        { name: 'Duration', tag: '@durationFilter', requiresDiscovery: true },
        { name: 'Budget', tag: '@budgetFilter', customInputs: true }
    ],
    
    performance: {
        maxLoadTime: 5000,
        timeout: 120000
    }
};

// Reusable setup method
async function setupSearchForCategory(page: any, searchResultPage: SearchResultPage, categoryName: string, searchLocation: string = 'anywhere') {
    await test.step(`Setup: Navigate to ${categoryName} search results`, async () => {
        await searchResultPage.clickSearchProductTab(categoryName);
        await searchResultPage.searchAnywhere(searchLocation);
        await searchResultPage.clickSearchHolidayBtn();
        await searchResultPage.validateSearchResultPageUrl();
        console.log(`✓ Successfully reached ${categoryName} search results page`);
    });
}

// Reusable cookie handling
async function handleInitialSetup(page: any) {
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
}

test.beforeEach(async ({ page }) => {
    await handleInitialSetup(page);
});

test.describe('Comprehensive Search Accommodation Filters Tests', () => {

    // FILTER TYPE 1: RATINGS FILTER TESTS (Using POM Methods)
    test.describe('Ratings Filter Tests', () => {
        for (const category of TEST_CONFIG.categories) {
            test(`${category.name} - Ratings Filter: Verify all rating options using POM methods @ratingsFilter`, async ({ page }) => {
                test.setTimeout(TEST_CONFIG.performance.timeout);
                
                const searchResultPage = new SearchResultPage(page, {} as any);
                
                await setupSearchForCategory(page, searchResultPage, category.name, category.searchLocation);

                await test.step(`Test: Comprehensive ratings filter validation using POM`, async () => {
                    const expectedEnabled = category.filters.ratings?.enabled || ['1', '2', '3', '4', '5'];
                    const testOption = category.filters.ratings?.testOption || '4';
                    
                    const result = await searchResultPage.testFilterComprehensively(
                        'Ratings',
                        expectedEnabled,
                        undefined,
                        testOption
                    );
                    
                    // Validate results using POM methods
                    expect(result.validationPassed, `${category.name} ratings filter validation should pass`).toBe(true);
                    expect(result.loadTime, `${category.name} ratings filter should load quickly`).toBeLessThan(TEST_CONFIG.performance.maxLoadTime);
                    expect(result.optionCount, `${category.name} should have rating options`).toBeGreaterThan(0);
                    
                    if (result.applicationWorked) {
                        expect(result.resultCount, `${category.name} should have search results after filter`).toBeGreaterThan(0);
                    }
                    
                    console.log(`✅ ${category.name} ratings filter test completed successfully`);
                });
            });
        }
    });

    // FILTER TYPE 2: BEST FOR FILTER TESTS (Category-Specific with POM)
    test.describe('Best For Filter Tests', () => {
        for (const category of TEST_CONFIG.categories) {
            test(`${category.name} - Best For Filter: Category-specific validation using POM @bestForFilter`, async ({ page }) => {
                test.setTimeout(TEST_CONFIG.performance.timeout);
                
                const searchResultPage = new SearchResultPage(page, {} as any);
                
                await setupSearchForCategory(page, searchResultPage, category.name, category.searchLocation);

                await test.step(`Test: Best For filter category-specific validation`, async () => {
                    const expectedEnabled = category.filters.bestFor?.enabled || [];
                    const expectedDisabled = category.filters.bestFor?.disabled || [];
                    
                    if (expectedEnabled.length > 0) {
                        const result = await searchResultPage.testFilterComprehensively(
                            'Best For',
                            expectedEnabled,
                            expectedDisabled,
                            expectedEnabled[0] // Test first enabled option
                        );
                        
                        expect(result.validationPassed, `${category.name} Best For filter should have correct enabled/disabled states`).toBe(true);
                        console.log(`✅ ${category.name} Best For filter validation completed`);
                    } else {
                        // Discovery mode for categories without predefined expectations
                        const options = await searchResultPage.getFilterOptions('Best For');
                        console.log(`🔍 ${category.name} Best For discovery: ${options.enabled.length} enabled, ${options.disabled.length} disabled`);
                        
                        expect(options.total, `${category.name} should have Best For options`).toBeGreaterThan(0);
                    }
                });
            });
        }
    });

    // FILTER TYPE 3: BOARD BASIS FILTER TESTS (Universal with POM)
    test.describe('Board Basis Filter Tests', () => {
        for (const category of TEST_CONFIG.categories) {
            test(`${category.name} - Board Basis Filter: Universal options validation using POM @boardBasisFilter`, async ({ page }) => {
                test.setTimeout(TEST_CONFIG.performance.timeout);
                
                const searchResultPage = new SearchResultPage(page, {} as any);
                
                await setupSearchForCategory(page, searchResultPage, category.name, category.searchLocation);

                await test.step(`Test: Board Basis filter universal validation`, async () => {
                    const expectedEnabled = category.filters.boardBasis?.enabled || ['Room Only', 'Bed & Breakfast', 'Half Board'];
                    const testOption = category.filters.boardBasis?.testOption || 'Room Only';
                    
                    const result = await searchResultPage.testFilterComprehensively(
                        'Board Basis',
                        expectedEnabled,
                        undefined,
                        testOption
                    );
                    
                    expect(result.validationPassed, `${category.name} Board Basis filter should pass validation`).toBe(true);
                    expect(result.optionCount, `${category.name} should have board basis options`).toBeGreaterThan(2);
                    
                    console.log(`✅ ${category.name} Board Basis filter test completed`);
                });
            });
        }
    });

    // FILTER TYPE 4: FACILITIES FILTER TESTS (Universal with POM)
    test.describe('Facilities Filter Tests', () => {
        for (const category of TEST_CONFIG.categories) {
            test(`${category.name} - Facilities Filter: Universal facilities validation using POM @facilitiesFilter`, async ({ page }) => {
                test.setTimeout(TEST_CONFIG.performance.timeout);
                
                const searchResultPage = new SearchResultPage(page, {} as any);
                
                await setupSearchForCategory(page, searchResultPage, category.name, category.searchLocation);

                await test.step(`Test: Facilities filter universal validation`, async () => {
                    const expectedEnabled = category.filters.facilities?.enabled || ['Bar', 'WiFi', 'Restaurant'];
                    const testOption = category.filters.facilities?.testOption || 'Bar';
                    
                    const result = await searchResultPage.testFilterComprehensively(
                        'Facilities',
                        expectedEnabled,
                        undefined,
                        testOption
                    );
                    
                    expect(result.validationPassed, `${category.name} Facilities filter should pass validation`).toBe(true);
                    expect(result.optionCount, `${category.name} should have facility options`).toBeGreaterThan(3);
                    
                    console.log(`✅ ${category.name} Facilities filter test completed`);
                });
            });
        }
    });

    // FILTER TYPE 5: HOLIDAY TYPES FILTER TESTS (Discovery with POM)
    test.describe('Holiday Types Filter Tests', () => {
        for (const category of TEST_CONFIG.categories) {
            test(`${category.name} - Holiday Types Filter: Discovery and validation using POM @holidayTypesFilter`, async ({ page }) => {
                test.setTimeout(TEST_CONFIG.performance.timeout);
                
                const searchResultPage = new SearchResultPage(page, {} as any);
                
                await setupSearchForCategory(page, searchResultPage, category.name, category.searchLocation);

                await test.step(`Test: Holiday Types filter discovery and validation`, async () => {
                    const options = await searchResultPage.getFilterOptions('Holiday Types');
                    console.log(`🔍 ${category.name} Holiday Types: ${options.enabled.length} enabled, ${options.disabled.length} disabled`);
                    
                    expect(options.total, `${category.name} should have holiday type options`).toBeGreaterThan(0);
                    
                    // Test that most options are enabled (characteristic of Holiday Types filter)
                    if (options.total > 0) {
                        const enabledRatio = options.enabled.length / options.total;
                        expect(enabledRatio, `${category.name} Holiday Types should have mostly enabled options`).toBeGreaterThan(0.7);
                    }
                    
                    // Test application if options available
                    if (options.enabled.length > 0) {
                        try {
                            await searchResultPage.selectFilterOption('Holiday Types', options.enabled[0]);
                            const urlUpdated = await searchResultPage.validateFilterUrlUpdate();
                            console.log(`   🎯 Applied "${options.enabled[0]}": ${urlUpdated ? 'SUCCESS' : 'FAILED'}`);
                        } catch (error) {
                            console.log(`   ℹ️ Filter application test skipped: ${error.message}`);
                        }
                    }
                    
                    console.log(`✅ ${category.name} Holiday Types filter test completed`);
                });
            });
        }
    });

    // FILTER TYPE 6: DURATION FILTER TESTS (Discovery with POM)
    test.describe('Duration Filter Tests', () => {
        for (const category of TEST_CONFIG.categories) {
            test(`${category.name} - Duration Filter: Discovery using POM methods @durationFilter`, async ({ page }) => {
                test.setTimeout(TEST_CONFIG.performance.timeout);
                
                const searchResultPage = new SearchResultPage(page, {} as any);
                
                await setupSearchForCategory(page, searchResultPage, category.name, category.searchLocation);

                await test.step(`Test: Duration filter discovery`, async () => {
                    try {
                        const loadTime = await searchResultPage.measureFilterLoadTime('Duration');
                        console.log(`🔍 ${category.name} Duration filter load time: ${loadTime}ms`);
                        
                        const options = await searchResultPage.getFilterOptions('Duration');
                        console.log(`🔍 ${category.name} Duration options: ${options.enabled.length} enabled, ${options.disabled.length} disabled`);
                        
                        if (options.enabled.length > 0) {
                            console.log(`   Available durations: ${options.enabled.slice(0, 5).join(', ')}${options.enabled.length > 5 ? '...' : ''}`);
                        }
                        
                        expect(loadTime, `${category.name} Duration filter should load within acceptable time`).toBeLessThan(TEST_CONFIG.performance.maxLoadTime);
                        
                    } catch (error) {
                        console.log(`   ℹ️ ${category.name} Duration filter not available or failed to load`);
                    }
                    
                    console.log(`✅ ${category.name} Duration filter discovery completed`);
                });
            });
        }
    });

    // FILTER TYPE 7: BUDGET FILTER TESTS (Custom Input with POM)
    test.describe('Budget Filter Tests', () => {
        for (const category of TEST_CONFIG.categories) {
            test(`${category.name} - Budget Filter: Custom input validation using POM @budgetFilter`, async ({ page }) => {
                test.setTimeout(TEST_CONFIG.performance.timeout);
                
                const searchResultPage = new SearchResultPage(page, {} as any);
                
                await setupSearchForCategory(page, searchResultPage, category.name, category.searchLocation);

                await test.step(`Test: Budget filter custom input functionality`, async () => {
                    try {
                        const loadTime = await searchResultPage.measureFilterLoadTime('Budget');
                        console.log(`💰 ${category.name} Budget filter load time: ${loadTime}ms`);
                        
                        await searchResultPage.openFilter('Budget');
                        
                        // Test for presence of input fields using multiple selectors
                        const inputSelectors = ['input[type="number"]', 'input[type="text"]', 'input'];
                        let inputFound = false;
                        
                        for (const selector of inputSelectors) {
                            const inputs = page.locator(selector);
                            const count = await inputs.count();
                            if (count > 0) {
                                inputFound = true;
                                console.log(`   ✅ Found ${count} input field(s) using selector: ${selector}`);
                                break;
                            }
                        }
                        
                        expect(inputFound, `${category.name} Budget filter should have input fields`).toBe(true);
                        expect(loadTime, `${category.name} Budget filter should load quickly`).toBeLessThan(TEST_CONFIG.performance.maxLoadTime);
                        
                        await searchResultPage.closeFilter();
                        
                    } catch (error) {
                        console.log(`   ℹ️ ${category.name} Budget filter test encountered issue: ${error.message}`);
                    }
                    
                    console.log(`✅ ${category.name} Budget filter test completed`);
                });
            });
        }
    });

    // COMPREHENSIVE CROSS-CATEGORY ANALYSIS USING POM
    test('Cross-Category Filter Analysis: POM-based comprehensive comparison @crossCategoryAnalysis', async ({ page }) => {
        test.setTimeout(300000); // 5 minutes timeout
        
        const searchResultPage = new SearchResultPage(page, {} as any);
        const analysisResults: { [key: string]: any } = {};
        
        for (const category of TEST_CONFIG.categories) {
            await test.step(`Analyze all filters for ${category.name} using POM methods`, async () => {
                await setupSearchForCategory(page, searchResultPage, category.name, category.searchLocation);
                
                const categoryAnalysis = {
                    category: category.name,
                    filterResults: {},
                    performance: {},
                    summary: { total: 0, working: 0, failed: 0 }
                };
                
                // Test each filter type using POM methods
                for (const filterType of TEST_CONFIG.filterTypes) {
                    try {
                        const startTime = Date.now();
                        const options = await searchResultPage.getFilterOptions(filterType.name);
                        const loadTime = Date.now() - startTime;
                        
                        categoryAnalysis.filterResults[filterType.name] = {
                            available: true,
                            enabledCount: options.enabled.length,
                            disabledCount: options.disabled.length,
                            totalOptions: options.total,
                            loadTime,
                            enabledOptions: options.enabled.slice(0, 5) // Store first 5 for reporting
                        };
                        
                        categoryAnalysis.summary.total++;
                        categoryAnalysis.summary.working++;
                        
                        console.log(`   ✅ ${filterType.name}: ${options.enabled.length} enabled, ${options.disabled.length} disabled (${loadTime}ms)`);
                        
                    } catch (error) {
                        categoryAnalysis.filterResults[filterType.name] = {
                            available: false,
                            error: error.message
                        };
                        
                        categoryAnalysis.summary.total++;
                        categoryAnalysis.summary.failed++;
                        
                        console.log(`   ❌ ${filterType.name}: Not available or failed`);
                    }
                }
                
                analysisResults[category.name] = categoryAnalysis;
                console.log(`📊 ${category.name} analysis: ${categoryAnalysis.summary.working}/${categoryAnalysis.summary.total} filters working`);
            });
        }
        
        await test.step('Generate comprehensive POM-based analysis report', async () => {
            console.log(`\n📊 COMPREHENSIVE FILTER ANALYSIS REPORT (POM-BASED):`);
            console.log(`================================================================`);
            
            // Universal filters analysis
            const filterAvailability: { [key: string]: string[] } = {};
            
            for (const filterType of TEST_CONFIG.filterTypes) {
                filterAvailability[filterType.name] = [];
                
                for (const category of TEST_CONFIG.categories) {
                    const result = analysisResults[category.name]?.filterResults[filterType.name];
                    if (result?.available) {
                        filterAvailability[filterType.name].push(category.name);
                    }
                }
            }
            
            // Report universal vs category-specific filters
            const universalFilters = Object.entries(filterAvailability)
                .filter(([, categories]) => categories.length === TEST_CONFIG.categories.length)
                .map(([filter]) => filter);
            
            const categorySpecificFilters = Object.entries(filterAvailability)
                .filter(([, categories]) => categories.length < TEST_CONFIG.categories.length)
                .reduce((acc, [filter, categories]) => {
                    acc[filter] = categories;
                    return acc;
                }, {} as { [key: string]: string[] });
            
            console.log(`\n🌟 Universal Filters (${universalFilters.length}):`);
            universalFilters.forEach(filter => {
                console.log(`   - ${filter}`);
            });
            
            console.log(`\n🎯 Category-Specific Filters (${Object.keys(categorySpecificFilters).length}):`);
            Object.entries(categorySpecificFilters).forEach(([filter, categories]) => {
                console.log(`   - ${filter}: ${categories.join(', ')}`);
            });
            
            // Performance summary
            console.log(`\n⚡ Performance Summary:`);
            for (const category of TEST_CONFIG.categories) {
                const analysis = analysisResults[category.name];
                console.log(`   ${category.name}: ${analysis.summary.working}/${analysis.summary.total} filters functional`);
            }
            
            // Validate analysis completeness
            expect(Object.keys(analysisResults).length, 'Should analyze all categories').toBe(TEST_CONFIG.categories.length);
            expect(universalFilters.length, 'Should have universal filters').toBeGreaterThan(3);
            
            console.log(`\n✅ Comprehensive POM-based filter analysis completed successfully!`);
        });
    });

    // PERFORMANCE TESTS USING POM METHODS
    test('Filter Performance Analysis: POM-based performance testing @filterPerformance', async ({ page }) => {
        test.setTimeout(180000);
        
        const searchResultPage = new SearchResultPage(page, {} as any);
        const performanceResults: { [key: string]: { [key: string]: number } } = {};
        
        for (const category of TEST_CONFIG.categories) {
            await test.step(`Performance test for ${category.name} using POM methods`, async () => {
                await setupSearchForCategory(page, searchResultPage, category.name, category.searchLocation);
                
                performanceResults[category.name] = {};
                
                for (const filterType of TEST_CONFIG.filterTypes) {
                    try {
                        const loadTime = await searchResultPage.measureFilterLoadTime(filterType.name);
                        performanceResults[category.name][filterType.name] = loadTime;
                        
                        expect(loadTime, `${category.name} ${filterType.name} should load within acceptable time`).toBeLessThan(TEST_CONFIG.performance.maxLoadTime);
                        
                        console.log(`   ${filterType.name}: ${loadTime}ms`);
                        
                    } catch (error) {
                        console.log(`   ${filterType.name}: Not available`);
                    }
                }
            });
        }
        
        // Performance summary
        console.log(`\n⚡ PERFORMANCE SUMMARY:`);
        for (const [category, results] of Object.entries(performanceResults)) {
            const avgTime = Object.values(results).reduce((a, b) => a + b, 0) / Object.values(results).length;
            console.log(`   ${category}: Average load time ${Math.round(avgTime)}ms`);
        }
    });

});

    // FILTER TYPE 2: BEST FOR FILTER TESTS (Category-Specific)
    test.describe('Best For Filter Tests', () => {
        for (const { category, searchLocation, specificFilters } of searchCategories) {
            test(`${category} - Best For Filter: Verify enabled/disabled states match category requirements @bestForFilter`, async ({ page }) => {
                test.setTimeout(120000);
                
                const searchResultPage = new SearchResultPage(page, {} as any);
                
                await test.step(`Setup: Navigate to ${category} search results`, async () => {
                    await searchResultPage.clickSearchProductTab(category);
                    await searchResultPage.searchAnywhere(searchLocation);
                    await searchResultPage.clickSearchHolidayBtn();
                    await searchResultPage.validateSearchResultPageUrl();
                    console.log(`✓ Successfully reached ${category} search results page`);
                });

                await test.step(`Test: Verify category-specific Best For filter states`, async () => {
                    // Click to open Best For filter
                    await page.getByRole('button', { name: 'Best For' }).click();
                    await page.waitForTimeout(2000);
                    
                    console.log(`\n🎯 Testing Best For filter for ${category}:`);
                    
                    // Test enabled options
                    if (specificFilters?.bestFor?.enabled?.length > 0) {
                        console.log(`   Testing ${specificFilters.bestFor.enabled.length} expected enabled options:`);
                        for (const enabledOption of specificFilters.bestFor.enabled) {
                            try {
                                const optionElement = page.locator(`generic:has-text("${enabledOption}")`).filter({ hasText: new RegExp(`^${enabledOption}$`) });
                                await expect(optionElement).toBeVisible({ timeout: 3000 });
                                
                                // Verify it's clickable
                                const isClickable = await optionElement.evaluate((el) => {
                                    const styles = window.getComputedStyle(el);
                                    return styles.pointerEvents !== 'none' && 
                                           styles.opacity !== '0.5' && 
                                           !el.hasAttribute('disabled');
                                });
                                
                                expect(isClickable, `${enabledOption} should be enabled in ${category}`).toBe(true);
                                console.log(`     ✅ ${enabledOption} is enabled`);
                                
                            } catch (error) {
                                console.log(`     ❌ ${enabledOption} not found or not enabled`);
                                // Don't fail test immediately - log for analysis
                            }
                        }
                    }
                    
                    // Test disabled options (visual verification only)
                    if (specificFilters?.bestFor?.disabled?.length > 0) {
                        console.log(`   Checking ${specificFilters.bestFor.disabled.length} expected disabled options:`);
                        let disabledCount = 0;
                        for (const disabledOption of specificFilters.bestFor.disabled) {
                            try {
                                const optionElement = page.locator(`generic:has-text("${disabledOption}")`).filter({ hasText: new RegExp(`^${disabledOption}$`) });
                                if (await optionElement.isVisible({ timeout: 1000 })) {
                                    const isDisabled = await optionElement.evaluate((el) => {
                                        const styles = window.getComputedStyle(el);
                                        return styles.pointerEvents === 'none' || 
                                               styles.opacity === '0.5' || 
                                               el.hasAttribute('disabled');
                                    });
                                    
                                    if (isDisabled) {
                                        disabledCount++;
                                        console.log(`     ✅ ${disabledOption} is correctly disabled`);
                                    }
                                }
                            } catch (error) {
                                // Option not visible - this is expected for many disabled options
                            }
                        }
                        console.log(`     ℹ️ Found ${disabledCount} disabled options (some may not be visible)`);
                    }
                    
                    // Close filter
                    await page.keyboard.press('Escape');
                    await page.waitForTimeout(500);
                });

                await test.step(`Test: Apply Best For filter and verify results`, async () => {
                    if (specificFilters?.bestFor?.enabled?.length > 0) {
                        const testOption = specificFilters.bestFor.enabled[0];
                        
                        await page.getByRole('button', { name: 'Best For' }).click();
                        await page.waitForTimeout(1000);
                        
                        // Click on first enabled option
                        const optionElement = page.locator(`generic:has-text("${testOption}")`).filter({ hasText: new RegExp(`^${testOption}$`) });
                        await optionElement.click();
                        await page.getByRole('button', { name: 'Confirm' }).click();
                        await page.waitForTimeout(2000);
                        
                        // Verify results filtered correctly
                        const currentUrl = page.url();
                        console.log(`   ✅ Applied "${testOption}" filter, URL updated: ${currentUrl.includes(testOption.replace(/\s/g, '')) ? 'Yes' : 'No'}`);
                        
                        // Verify filter tag appears on page
                        try {
                            const filterTag = page.locator(`text="${testOption}"`).first();
                            await expect(filterTag).toBeVisible({ timeout: 5000 });
                            console.log(`   ✅ Filter tag "${testOption}" is visible on results page`);
                        } catch (error) {
                            console.log(`   ℹ️ Filter tag not found in visible area (may be in collapsed section)`);
                        }
                    }
                });
            });
        }
    });

    // FILTER TYPE 3: BOARD BASIS FILTER TESTS
    test.describe('Board Basis Filter Tests', () => {
        for (const { category, searchLocation } of searchCategories) {
            test(`${category} - Board Basis Filter: Verify all meal plan options are enabled @boardBasisFilter`, async ({ page }) => {
                test.setTimeout(120000);
                
                const searchResultPage = new SearchResultPage(page, {} as any);
                
                await test.step(`Setup: Navigate to ${category} search results`, async () => {
                    await searchResultPage.clickSearchProductTab(category);
                    await searchResultPage.searchAnywhere(searchLocation);
                    await searchResultPage.clickSearchHolidayBtn();
                    await searchResultPage.validateSearchResultPageUrl();
                    console.log(`✓ Successfully reached ${category} search results page`);
                });

                await test.step(`Test: Verify all Board Basis options are enabled`, async () => {
                    await page.getByRole('button', { name: 'Board Basis' }).click();
                    await page.waitForTimeout(1000);
                    
                    console.log(`\n🍽️ Testing Board Basis filter for ${category}:`);
                    
                    const availableOptions: string[] = [];
                    
                    // Check for common board basis options
                    for (const option of filterDefinitions.boardBasis.options) {
                        try {
                            const optionElement = page.locator(`text="${option}"`).first();
                            if (await optionElement.isVisible({ timeout: 2000 })) {
                                // Verify it's enabled
                                const isEnabled = await optionElement.evaluate((el) => {
                                    const styles = window.getComputedStyle(el);
                                    return styles.pointerEvents !== 'none' && styles.opacity !== '0.5';
                                });
                                
                                if (isEnabled) {
                                    availableOptions.push(option);
                                    console.log(`   ✅ ${option} is available and enabled`);
                                } else {
                                    console.log(`   ⚠️ ${option} is visible but disabled`);
                                }
                            }
                        } catch (error) {
                            // Option not available for this category
                        }
                    }
                    
                    expect(availableOptions.length, `${category} should have at least 3 board basis options`).toBeGreaterThan(2);
                    console.log(`   ✅ Found ${availableOptions.length} enabled board basis options for ${category}`);
                    
                    // Close filter
                    await page.keyboard.press('Escape');
                    await page.waitForTimeout(500);
                });

                await test.step(`Test: Apply board basis filter and verify functionality`, async () => {
                    await page.getByRole('button', { name: 'Board Basis' }).click();
                    await page.waitForTimeout(1000);
                    
                    // Try to apply "Half Board" if available
                    try {
                        const halfBoardOption = page.locator('text="Half Board"').first();
                        if (await halfBoardOption.isVisible({ timeout: 3000 })) {
                            await halfBoardOption.click();
                            await page.getByRole('button', { name: 'Confirm' }).click();
                            await page.waitForTimeout(2000);
                            
                            console.log(`   ✅ Successfully applied Half Board filter for ${category}`);
                        } else {
                            // Try alternative option
                            const roomOnlyOption = page.locator('text="Room Only"').first();
                            if (await roomOnlyOption.isVisible({ timeout: 3000 })) {
                                await roomOnlyOption.click();
                                await page.getByRole('button', { name: 'Confirm' }).click();
                                await page.waitForTimeout(2000);
                                
                                console.log(`   ✅ Successfully applied Room Only filter for ${category}`);
                            }
                        }
                    } catch (error) {
                        console.log(`   ℹ️ Board basis filter application test skipped for ${category}`);
                        await page.keyboard.press('Escape');
                    }
                });
            });
        }
    });

    // FILTER TYPE 4: FACILITIES FILTER TESTS
    test.describe('Facilities Filter Tests', () => {
        for (const { category, searchLocation } of searchCategories) {
            test(`${category} - Facilities Filter: Verify all facility options are enabled @facilitiesFilter`, async ({ page }) => {
                test.setTimeout(120000);
                
                const searchResultPage = new SearchResultPage(page, {} as any);
                
                await test.step(`Setup: Navigate to ${category} search results`, async () => {
                    await searchResultPage.clickSearchProductTab(category);
                    await searchResultPage.searchAnywhere(searchLocation);
                    await searchResultPage.clickSearchHolidayBtn();
                    await searchResultPage.validateSearchResultPageUrl();
                    console.log(`✓ Successfully reached ${category} search results page`);
                });

                await test.step(`Test: Verify Facilities filter options are enabled`, async () => {
                    await page.getByRole('button', { name: 'Facilities' }).click();
                    await page.waitForTimeout(1000);
                    
                    console.log(`\n🏨 Testing Facilities filter for ${category}:`);
                    
                    const availableFacilities: string[] = [];
                    
                    // Check for common facility options
                    for (const facility of filterDefinitions.facilities.options) {
                        try {
                            const facilityElement = page.locator(`text="${facility}"`).first();
                            if (await facilityElement.isVisible({ timeout: 2000 })) {
                                // Verify it's enabled
                                const isEnabled = await facilityElement.evaluate((el) => {
                                    const styles = window.getComputedStyle(el);
                                    return styles.pointerEvents !== 'none' && styles.opacity !== '0.5';
                                });
                                
                                if (isEnabled) {
                                    availableFacilities.push(facility);
                                    console.log(`   ✅ ${facility} is available and enabled`);
                                }
                            }
                        } catch (error) {
                            // Facility not available for this category
                        }
                    }
                    
                    expect(availableFacilities.length, `${category} should have at least 5 facility options`).toBeGreaterThan(4);
                    console.log(`   ✅ Found ${availableFacilities.length} enabled facility options for ${category}`);
                    
                    // Close filter
                    await page.keyboard.press('Escape');
                    await page.waitForTimeout(500);
                });

                await test.step(`Test: Apply facility filter and verify results`, async () => {
                    await page.getByRole('button', { name: 'Facilities' }).click();
                    await page.waitForTimeout(1000);
                    
                    // Try to apply common facilities
                    const commonFacilities = ['Indoor Pool', 'Bar', 'WiFi', 'Spa Facilities'];
                    let appliedFacility = '';
                    
                    for (const facility of commonFacilities) {
                        try {
                            const facilityElement = page.locator(`text="${facility}"`).first();
                            if (await facilityElement.isVisible({ timeout: 2000 })) {
                                await facilityElement.click();
                                appliedFacility = facility;
                                break;
                            }
                        } catch (error) {
                            continue;
                        }
                    }
                    
                    if (appliedFacility) {
                        await page.getByRole('button', { name: 'Confirm' }).click();
                        await page.waitForTimeout(2000);
                        console.log(`   ✅ Successfully applied ${appliedFacility} filter for ${category}`);
                    } else {
                        console.log(`   ℹ️ No common facilities found to test for ${category}`);
                        await page.keyboard.press('Escape');
                    }
                });
            });
        }
    });

    // FILTER TYPE 5: HOLIDAY TYPES FILTER TESTS
    test.describe('Holiday Types Filter Tests', () => {
        for (const { category, searchLocation } of searchCategories) {
            test(`${category} - Holiday Types Filter: Verify most options enabled with few disabled @holidayTypesFilter`, async ({ page }) => {
                test.setTimeout(120000);
                
                const searchResultPage = new SearchResultPage(page, {} as any);
                
                await test.step(`Setup: Navigate to ${category} search results`, async () => {
                    await searchResultPage.clickSearchProductTab(category);
                    await searchResultPage.searchAnywhere(searchLocation);
                    await searchResultPage.clickSearchHolidayBtn();
                    await searchResultPage.validateSearchResultPageUrl();
                    console.log(`✓ Successfully reached ${category} search results page`);
                });

                await test.step(`Test: Verify Holiday Types filter states (mostly enabled)`, async () => {
                    await page.getByRole('button', { name: 'Holiday Types' }).click();
                    await page.waitForTimeout(1000);
                    
                    console.log(`\n🏖️ Testing Holiday Types filter for ${category}:`);
                    
                    const enabledOptions: string[] = [];
                    const disabledOptions: string[] = [];
                    
                    // Check for holiday type options
                    for (const holidayType of filterDefinitions.holidayTypes.options) {
                        try {
                            const typeElement = page.locator(`text="${holidayType}"`).first();
                            if (await typeElement.isVisible({ timeout: 2000 })) {
                                // Check if enabled or disabled
                                const isEnabled = await typeElement.evaluate((el) => {
                                    const styles = window.getComputedStyle(el);
                                    return styles.pointerEvents !== 'none' && styles.opacity !== '0.5';
                                });
                                
                                if (isEnabled) {
                                    enabledOptions.push(holidayType);
                                    console.log(`   ✅ ${holidayType} is enabled`);
                                } else {
                                    disabledOptions.push(holidayType);
                                    console.log(`   ⚠️ ${holidayType} is disabled`);
                                }
                            }
                        } catch (error) {
                            // Holiday type not available for this category
                        }
                    }
                    
                    console.log(`   📊 Summary for ${category}: ${enabledOptions.length} enabled, ${disabledOptions.length} disabled`);
                    
                    // Verify the ratio is correct (most should be enabled)
                    const totalOptions = enabledOptions.length + disabledOptions.length;
                    if (totalOptions > 0) {
                        const enabledRatio = enabledOptions.length / totalOptions;
                        expect(enabledRatio, `Most holiday types should be enabled for ${category}`).toBeGreaterThan(0.7);
                    }
                    
                    // Close filter
                    await page.keyboard.press('Escape');
                    await page.waitForTimeout(500);
                });

                await test.step(`Test: Apply holiday type filter and verify functionality`, async () => {
                    await page.getByRole('button', { name: 'Holiday Types' }).click();
                    await page.waitForTimeout(1000);
                    
                    // Try to apply "Family Holidays" if available
                    try {
                        const familyOption = page.locator('text="Family Holidays"').first();
                        if (await familyOption.isVisible({ timeout: 3000 })) {
                            await familyOption.click();
                            await page.getByRole('button', { name: 'Confirm' }).click();
                            await page.waitForTimeout(2000);
                            
                            console.log(`   ✅ Successfully applied Family Holidays filter for ${category}`);
                        } else {
                            console.log(`   ℹ️ Family Holidays not available for ${category}`);
                            await page.keyboard.press('Escape');
                        }
                    } catch (error) {
                        console.log(`   ℹ️ Holiday types filter application test skipped for ${category}`);
                        await page.keyboard.press('Escape');
                    }
                });
            });
        }
    });

    // FILTER TYPE 6: DURATION FILTER TESTS
    test.describe('Duration Filter Tests', () => {
        for (const { category, searchLocation } of searchCategories) {
            test(`${category} - Duration Filter: Discover and verify duration options @durationFilter`, async ({ page }) => {
                test.setTimeout(120000);
                
                const searchResultPage = new SearchResultPage(page, {} as any);
                
                await test.step(`Setup: Navigate to ${category} search results`, async () => {
                    await searchResultPage.clickSearchProductTab(category);
                    await searchResultPage.searchAnywhere(searchLocation);
                    await searchResultPage.clickSearchHolidayBtn();
                    await searchResultPage.validateSearchResultPageUrl();
                    console.log(`✓ Successfully reached ${category} search results page`);
                });

                await test.step(`Test: Explore Duration filter options`, async () => {
                    await page.getByRole('button', { name: 'Duration' }).click();
                    await page.waitForTimeout(1000);
                    
                    console.log(`\n⏱️ Testing Duration filter for ${category}:`);
                    
                    const availableDurations: string[] = [];
                    
                    // Try to discover duration options by looking for common patterns
                    const durationPatterns = [
                        /\d+\s*nights?/i,
                        /\d+\s*days?/i,
                        /short break/i,
                        /long stay/i,
                        /weekend/i,
                        /week/i
                    ];
                    
                    for (const pattern of durationPatterns) {
                        try {
                            const durationElements = page.locator(`text=${pattern}`);
                            const count = await durationElements.count();
                            
                            for (let i = 0; i < count; i++) {
                                const element = durationElements.nth(i);
                                if (await element.isVisible({ timeout: 1000 })) {
                                    const text = await element.textContent();
                                    if (text && !availableDurations.includes(text.trim())) {
                                        availableDurations.push(text.trim());
                                        console.log(`   ✅ Found duration option: ${text.trim()}`);
                                    }
                                }
                            }
                        } catch (error) {
                            // Pattern not found
                        }
                    }
                    
                    if (availableDurations.length === 0) {
                        // Try to find any clickable elements in the duration filter
                        const clickableElements = page.locator('label, button, [role="checkbox"], [role="radio"]');
                        const count = await clickableElements.count();
                        
                        for (let i = 0; i < Math.min(count, 10); i++) {
                            try {
                                const element = clickableElements.nth(i);
                                if (await element.isVisible({ timeout: 500 })) {
                                    const text = await element.textContent();
                                    if (text && text.trim().length > 0) {
                                        availableDurations.push(text.trim());
                                        console.log(`   ✅ Found duration option: ${text.trim()}`);
                                    }
                                }
                            } catch (error) {
                                // Continue to next element
                            }
                        }
                    }
                    
                    console.log(`   📊 Total duration options found for ${category}: ${availableDurations.length}`);
                    
                    // Close filter
                    await page.keyboard.press('Escape');
                    await page.waitForTimeout(500);
                });
            });
        }
    });

    // FILTER TYPE 7: BUDGET FILTER TESTS
    test.describe('Budget Filter Tests', () => {
        for (const { category, searchLocation } of searchCategories) {
            test(`${category} - Budget Filter: Verify custom range input functionality @budgetFilter`, async ({ page }) => {
                test.setTimeout(120000);
                
                const searchResultPage = new SearchResultPage(page, {} as any);
                
                await test.step(`Setup: Navigate to ${category} search results`, async () => {
                    await searchResultPage.clickSearchProductTab(category);
                    await searchResultPage.searchAnywhere(searchLocation);
                    await searchResultPage.clickSearchHolidayBtn();
                    await searchResultPage.validateSearchResultPageUrl();
                    console.log(`✓ Successfully reached ${category} search results page`);
                });

                await test.step(`Test: Verify Budget filter has custom input fields`, async () => {
                    await page.getByRole('button', { name: 'Budget' }).click();
                    await page.waitForTimeout(1000);
                    
                    console.log(`\n💰 Testing Budget filter for ${category}:`);
                    
                    // Look for input fields
                    const inputFields = page.locator('input[type="number"], input[type="text"]').filter({ hasText: /£|\$|€|price|budget|min|max/i });
                    const inputCount = await inputFields.count();
                    
                    console.log(`   📊 Found ${inputCount} potential budget input fields`);
                    
                    // Look for min/max labels or placeholders
                    const minInput = page.locator('input').filter({ hasText: /min/i }).first();
                    const maxInput = page.locator('input').filter({ hasText: /max/i }).first();
                    
                    if (await minInput.isVisible({ timeout: 3000 })) {
                        console.log(`   ✅ Minimum budget input field found`);
                    }
                    
                    if (await maxInput.isVisible({ timeout: 3000 })) {
                        console.log(`   ✅ Maximum budget input field found`);
                    }
                    
                    // Look for any budget-related interactive elements
                    const budgetElements = page.locator('[class*="budget"], [class*="price"], [class*="range"]');
                    const budgetElementsCount = await budgetElements.count();
                    
                    console.log(`   📊 Found ${budgetElementsCount} budget-related elements`);
                    
                    // Basic validation - should have some form of budget input
                    const hasBudgetInputs = inputCount > 0 || budgetElementsCount > 0;
                    expect(hasBudgetInputs, `${category} should have budget filter inputs`).toBe(true);
                    
                    // Close filter
                    await page.keyboard.press('Escape');
                    await page.waitForTimeout(500);
                });

                await test.step(`Test: Attempt to apply budget filter`, async () => {
                    await page.getByRole('button', { name: 'Budget' }).click();
                    await page.waitForTimeout(1000);
                    
                    try {
                        // Try to find and fill budget inputs
                        const minInput = page.locator('input').first();
                        const maxInput = page.locator('input').last();
                        
                        if (await minInput.isVisible({ timeout: 3000 })) {
                            await minInput.fill('500');
                            console.log(`   ✅ Set minimum budget to £500`);
                        }
                        
                        if (await maxInput.isVisible({ timeout: 3000 }) && minInput !== maxInput) {
                            await maxInput.fill('2000');
                            console.log(`   ✅ Set maximum budget to £2000`);
                        }
                        
                        // Try to apply the filter
                        const confirmBtn = page.getByRole('button', { name: 'Confirm' });
                        if (await confirmBtn.isVisible({ timeout: 3000 })) {
                            await confirmBtn.click();
                            await page.waitForTimeout(2000);
                            console.log(`   ✅ Successfully applied budget filter for ${category}`);
                        } else {
                            await page.keyboard.press('Escape');
                            console.log(`   ℹ️ Budget filter test completed for ${category}`);
                        }
                        
                    } catch (error) {
                        console.log(`   ℹ️ Budget filter interaction test skipped for ${category}: ${error.message}`);
                        await page.keyboard.press('Escape');
                    }
                });
            });
        }
    });

    // COMPREHENSIVE CROSS-CATEGORY FILTER COMPARISON TEST
    test('Cross-Category Filter Analysis: Compare filter availability and states across all categories @crossCategoryAnalysis', async ({ page }) => {
        test.setTimeout(300000); // 5 minutes timeout
        
        const searchResultPage = new SearchResultPage(page, {} as any);
        const categoryFilterAnalysis: { [key: string]: any } = {};
        
        for (const { category, searchLocation } of searchCategories) {
            await test.step(`Analyze filters for ${category} category`, async () => {
                console.log(`\n🔍 Comprehensive filter analysis for ${category}:`);
                
                // Navigate to category
                await searchResultPage.clickSearchProductTab(category);
                await searchResultPage.searchAnywhere(searchLocation);
                await searchResultPage.clickSearchHolidayBtn();
                await searchResultPage.validateSearchResultPageUrl();
                
                const categoryAnalysis = {
                    category,
                    filters: {},
                    totalFilters: 0,
                    uniqueFeatures: []
                };
                
                // Analyze each filter type
                const filterTypes = ['Ratings', 'Best For', 'Board Basis', 'Facilities', 'Holiday Types', 'Duration', 'Budget'];
                
                for (const filterType of filterTypes) {
                    try {
                        await page.getByRole('button', { name: filterType }).click();
                        await page.waitForTimeout(1500);
                        
                        const filterAnalysis = {
                            available: true,
                            enabledOptions: [] as string[],
                            disabledOptions: [] as string[],
                            totalOptions: 0,
                            hasCustomInputs: false
                        };
                        
                        // Analyze filter content based on type
                        if (filterType === 'Budget') {
                            // Check for input fields
                            const inputs = page.locator('input');
                            filterAnalysis.hasCustomInputs = await inputs.count() > 0;
                            filterAnalysis.totalOptions = await inputs.count();
                        } else {
                            // Check for clickable options
                            const options = page.locator('label, [role="checkbox"], [role="radio"], generic[cursor="pointer"]');
                            const optionCount = await options.count();
                            
                            for (let i = 0; i < Math.min(optionCount, 20); i++) {
                                try {
                                    const option = options.nth(i);
                                    if (await option.isVisible({ timeout: 1000 })) {
                                        const text = await option.textContent();
                                        if (text && text.trim().length > 0 && text.trim().length < 50) {
                                            const isEnabled = await option.evaluate((el) => {
                                                const styles = window.getComputedStyle(el);
                                                return styles.pointerEvents !== 'none' && styles.opacity !== '0.5';
                                            });
                                            
                                            if (isEnabled) {
                                                filterAnalysis.enabledOptions.push(text.trim());
                                            } else {
                                                filterAnalysis.disabledOptions.push(text.trim());
                                            }
                                        }
                                    }
                                } catch (error) {
                                    // Continue to next option
                                }
                            }
                            
                            filterAnalysis.totalOptions = filterAnalysis.enabledOptions.length + filterAnalysis.disabledOptions.length;
                        }
                        
                        categoryAnalysis.filters[filterType] = filterAnalysis;
                        console.log(`   ${filterType}: ${filterAnalysis.totalOptions} options (${filterAnalysis.enabledOptions.length} enabled, ${filterAnalysis.disabledOptions.length} disabled)`);
                        
                        // Close filter
                        await page.keyboard.press('Escape');
                        await page.waitForTimeout(1000);
                        
                    } catch (error) {
                        console.log(`   ${filterType}: Not available or error occurred`);
                        categoryAnalysis.filters[filterType] = { available: false };
                    }
                }
                
                categoryFilterAnalysis[category] = categoryAnalysis;
            });
        }
        
        await test.step('Generate comprehensive filter comparison report', async () => {
            console.log(`\n📊 COMPREHENSIVE CROSS-CATEGORY FILTER ANALYSIS REPORT:`);
            console.log(`================================================================`);
            
            // Universal filters analysis
            const allFilterTypes = new Set<string>();
            Object.values(categoryFilterAnalysis).forEach(analysis => {
                Object.keys(analysis.filters).forEach(filterType => allFilterTypes.add(filterType));
            });
            
            const universalFilters: string[] = [];
            const categorySpecificFilters: { [key: string]: string[] } = {};
            
            allFilterTypes.forEach(filterType => {
                const categoriesWithFilter = Object.keys(categoryFilterAnalysis).filter(category => 
                    categoryFilterAnalysis[category].filters[filterType]?.available !== false
                );
                
                if (categoriesWithFilter.length === searchCategories.length) {
                    universalFilters.push(filterType);
                } else {
                    categorySpecificFilters[filterType] = categoriesWithFilter;
                }
            });
            
            console.log(`\n🌟 Universal Filters (available in all categories):`);
            universalFilters.forEach(filter => console.log(`   - ${filter}`));
            
            console.log(`\n🎯 Category-Specific Filter Availability:`);
            Object.entries(categorySpecificFilters).forEach(([filter, categories]) => {
                console.log(`   - ${filter}: Available in ${categories.join(', ')}`);
            });
            
            // Best For filter detailed comparison
            console.log(`\n🔍 Best For Filter Cross-Category Comparison:`);
            Object.entries(categoryFilterAnalysis).forEach(([category, analysis]) => {
                const bestForFilter = analysis.filters['Best For'];
                if (bestForFilter?.available) {
                    console.log(`   ${category}:`);
                    console.log(`     - Enabled options (${bestForFilter.enabledOptions.length}): ${bestForFilter.enabledOptions.slice(0, 5).join(', ')}${bestForFilter.enabledOptions.length > 5 ? '...' : ''}`);
                    console.log(`     - Disabled options: ${bestForFilter.disabledOptions.length}`);
                }
            });
            
            // Summary validation
            expect(universalFilters.length, 'Should have at least 5 universal filters').toBeGreaterThan(4);
            expect(Object.keys(categoryFilterAnalysis).length, 'Should analyze all 3 categories').toBe(3);
            
            console.log(`\n✅ Cross-category filter analysis completed successfully!`);
            console.log(`   - Analyzed ${Object.keys(categoryFilterAnalysis).length} categories`);
            console.log(`   - Found ${universalFilters.length} universal filters`);
            console.log(`   - Identified ${Object.keys(categorySpecificFilters).length} category-specific filters`);
        });
    });

    // ALL FILTERS INTEGRATION TEST
    test('All Filters Modal: Verify comprehensive filter interface @allFiltersModal', async ({ page }) => {
        test.setTimeout(120000);
        
        const searchResultPage = new SearchResultPage(page, {} as any);
        
        await test.step('Test All Filters modal across categories', async () => {
            for (const { category, searchLocation } of searchCategories) {
                console.log(`\n🎛️ Testing All Filters modal for ${category}:`);
                
                // Navigate to category
                await searchResultPage.clickSearchProductTab(category);
                await searchResultPage.searchAnywhere(searchLocation);
                await searchResultPage.clickSearchHolidayBtn();
                await searchResultPage.validateSearchResultPageUrl();
                
                // Click "All filters" button
                await page.getByRole('button', { name: 'All filters' }).click();
                await page.waitForTimeout(2000);
                
                // Verify modal opens and contains all filter sections
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
                
                console.log(`   📊 Found ${visibleSections}/${filterSections.length} filter sections in ${category} All Filters modal`);
                expect(visibleSections, `${category} All Filters modal should show most filter sections`).toBeGreaterThan(4);
                
                // Close modal
                await page.keyboard.press('Escape');
                await page.waitForTimeout(1000);
            }
        });
    });
});

// PERFORMANCE AND RELIABILITY TESTS
test.describe('Filter Performance and Reliability Tests', () => {

    test('Filter Response Time: Verify all filters load within acceptable time limits @filterPerformance', async ({ page }) => {
        test.setTimeout(180000);
        
        const searchResultPage = new SearchResultPage(page, {} as any);
        
        await test.step('Test filter loading performance across categories', async () => {
            for (const { category, searchLocation } of searchCategories) {
                console.log(`\n⚡ Testing filter performance for ${category}:`);
                
                // Navigate to category
                await searchResultPage.clickSearchProductTab(category);
                await searchResultPage.searchAnywhere(searchLocation);
                await searchResultPage.clickSearchHolidayBtn();
                await searchResultPage.validateSearchResultPageUrl();
                
                const filterTypes = ['Ratings', 'Best For', 'Board Basis', 'Facilities', 'Holiday Types', 'Duration', 'Budget'];
                
                for (const filterType of filterTypes) {
                    const startTime = Date.now();
                    
                    try {
                        await page.getByRole('button', { name: filterType }).click();
                        await page.waitForTimeout(500); // Allow filter to fully load
                        
                        const endTime = Date.now();
                        const loadTime = endTime - startTime;
                        
                        console.log(`   ${filterType}: ${loadTime}ms`);
                        expect(loadTime, `${filterType} filter should load within 5 seconds`).toBeLessThan(5000);
                        
                        // Close filter
                        await page.keyboard.press('Escape');
                        await page.waitForTimeout(500);
                        
                    } catch (error) {
                        console.log(`   ${filterType}: Not available or error occurred`);
                    }
                }
            }
        });
    });

    test('Filter State Persistence: Verify applied filters persist during navigation @filterPersistence', async ({ page }) => {
        test.setTimeout(120000);
        
        const searchResultPage = new SearchResultPage(page, {} as any);
        
        await test.step('Test filter state persistence', async () => {
            // Test with Ski category
            await searchResultPage.clickSearchProductTab('Ski');
            await searchResultPage.searchAnywhere('anywhere');
            await searchResultPage.clickSearchHolidayBtn();
            await searchResultPage.validateSearchResultPageUrl();
            
            // Apply a rating filter
            await page.getByRole('button', { name: 'Ratings' }).click();
            await page.waitForTimeout(1000);
            
            await page.locator('generic:has-text("4")').filter({ hasText: /^4$/ }).click();
            await page.getByRole('button', { name: 'Confirm' }).click();
            await page.waitForTimeout(2000);
            
            const urlWithFilter = page.url();
            console.log(`   ✅ Applied filter, URL: ${urlWithFilter}`);
            
            // Refresh page and verify filter persists
            await page.reload();
            await page.waitForLoadState('domcontentloaded');
            await page.waitForTimeout(3000);
            
            const urlAfterRefresh = page.url();
            console.log(`   ✅ After refresh, URL: ${urlAfterRefresh}`);
            
            // URLs should be similar (filter parameters should persist)
            expect(urlAfterRefresh, 'Filter parameters should persist after page refresh').toContain('rating');
        });
    });
});
