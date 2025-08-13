import { SearchResultPage } from '../page_objects/search_result_page';
import { Page } from '@playwright/test';

/**
 * REUSABLE FILTER TEST HELPERS
 * 
 * This file contains reusable helper functions and data structures for filter testing
 * following proper POM principles and reducing code duplication
 */

// =================== TEST DATA CONFIGURATIONS ===================

export const FilterTestData = {
    categories: [
        { 
            name: 'Ski', 
            searchLocation: 'anywhere',
            expectedResults: { min: 10, max: 1000 },
            specificFilters: {
                bestFor: {
                    enabled: ['Ski In/Ski Out', 'Central Location', 'Close to Lifts', 'Family-Run', 'Small Hotel', 'Activities', 'Spa & Wellness', 'Inghams Choice', 'Food & Drink'],
                    disabled: ['Rail Options', 'Self Drive', 'Large Ski Area', 'High Altitude', 'Glacier Skiing', 'Snowboarders', 'Advanced Skiers', 'Intermediate Skiers', 'Non-Skiers', 'Apres', 'Sightseeing', 'Ski Guiding', 'Short Transfers', 'Sports / Pool Complex', 'Ski School', 'First Time Skiers', 'Cross-Country Skiing', 'Parking']
                }
            }
        },
        { 
            name: 'Walking', 
            searchLocation: 'anywhere',
            expectedResults: { min: 50, max: 500 },
            specificFilters: {
                bestFor: {
                    enabled: ['Family Friendly', 'Central Location', 'Small Hotel', 'Spa & Wellness', 'Food & Drink', 'Dog Friendly', 'Activities'],
                    disabled: ['Family-Run', 'Large Hotel', 'Beach Location', 'Mountain Location', 'Self Catering', 'Romantic', 'Adventure', 'Cultural', 'Wildlife', 'Photography', 'Botanical', 'Historical', 'Local Culture', 'Authentic Experience', 'Local Guides', 'Small Groups', 'Private Groups', 'Fixed Groups', 'Flexible Itinerary', 'Moderate Pace']
                }
            }
        },
        { 
            name: 'Lapland', 
            searchLocation: 'anywhere',
            expectedResults: { min: 5, max: 100 },
            specificFilters: {
                bestFor: {
                    enabled: [], // To be discovered
                    disabled: [] // To be discovered
                }
            }
        }
    ],

    universalFilters: {
        ratings: {
            type: 'radio-buttons',
            options: ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5'],
            allEnabled: true,
            testOption: '4'
        },
        boardBasis: {
            type: 'checkboxes',
            options: ['Room Only', 'Bed & Breakfast', 'Half Board', 'Full Board', 'All Inclusive', 'Self Catering'],
            allEnabled: true,
            testOption: 'Half Board'
        },
        facilities: {
            type: 'checkboxes',
            options: ['Indoor Pool', 'Outdoor Pool', 'Spa Facilities', 'Sauna/Steam Room', 'Bar', 'Restaurant', 'Kids Club', 'Family Rooms', 'Single Rooms', 'Group Holidays', 'Disabled Access', 'WiFi', 'Parking', 'Pet Friendly', 'Lift Access'],
            allEnabled: true,
            testOption: 'WiFi'
        },
        holidayTypes: {
            type: 'checkboxes',
            options: ['Family Holidays', 'Romantic Holidays', 'Group Holidays', 'Adult Only', 'All Inclusive', 'Short Breaks', 'Long Stays', 'Luxury', 'Budget', 'Mid Range', 'Adventure', 'Cultural'],
            mostlyEnabled: true,
            expectedDisabled: 1,
            testOption: 'Family Holidays'
        }
    },

    performanceThresholds: {
        filterLoadTime: 5000, // 5 seconds max
        filterApplicationTime: 3000, // 3 seconds max
        pageNavigationTime: 10000 // 10 seconds max
    }
};

// =================== REUSABLE HELPER FUNCTIONS ===================

export class FilterTestHelpers {
    private page: Page;
    private searchResultPage: SearchResultPage;

    constructor(page: Page, searchResultPage: SearchResultPage) {
        this.page = page;
        this.searchResultPage = searchResultPage;
    }

    /**
     * Sets up search results for a specific category (reusable across all tests)
     */
    async setupCategorySearch(categoryName: string, searchLocation: string = 'anywhere'): Promise<void> {
        console.log(`🔧 Setting up ${categoryName} search results...`);
        await this.searchResultPage.navigateToSearchResults(categoryName, searchLocation);
        console.log(`✓ Successfully navigated to ${categoryName} search results`);
    }

    /**
     * Validates a universal filter (one that should work the same across all categories)
     */
    async validateUniversalFilter(
        filterName: string, 
        expectedOptions: string[], 
        testOption?: string
    ): Promise<{
        validationPassed: boolean;
        enabledCount: number;
        applicationWorked: boolean;
    }> {
        console.log(`\n🌐 Testing universal filter: ${filterName}`);
        
        // Validate all options are enabled
        const validation = await this.searchResultPage.validateFilterOptions(filterName, expectedOptions);
        
        let applicationWorked = false;
        
        // Test application if test option provided
        if (testOption && validation.allOptionsEnabled) {
            try {
                const result = await this.searchResultPage.applyFilterAndValidate(
                    filterName, 
                    testOption,
                    { expectUrlUpdate: true }
                );
                applicationWorked = result.applied && result.urlUpdated;
                
                // Reset filter
                await this.searchResultPage.resetFilter(filterName, testOption);
            } catch (error) {
                console.warn(`⚠️ Filter application test failed: ${error.message}`);
            }
        }
        
        return {
            validationPassed: validation.allOptionsEnabled,
            enabledCount: validation.enabledCount,
            applicationWorked
        };
    }

    /**
     * Validates a category-specific filter with expected enabled/disabled states
     */
    async validateCategorySpecificFilter(
        filterName: string,
        categoryConfig: { enabled: string[]; disabled: string[] },
        testOption?: string
    ): Promise<{
        validationPassed: boolean;
        enabledMatches: number;
        applicationWorked: boolean;
    }> {
        console.log(`\n🎯 Testing category-specific filter: ${filterName}`);
        
        const validation = await this.searchResultPage.validateCategorySpecificFilter(filterName, categoryConfig);
        
        let applicationWorked = false;
        
        // Test application with first enabled option if no test option provided
        const optionToTest = testOption || categoryConfig.enabled[0];
        
        if (optionToTest && validation.validationPassed) {
            try {
                const result = await this.searchResultPage.applyFilterAndValidate(
                    filterName,
                    optionToTest,
                    { expectUrlUpdate: true }
                );
                applicationWorked = result.applied && result.urlUpdated;
                
                // Reset filter
                await this.searchResultPage.resetFilter(filterName, optionToTest);
            } catch (error) {
                console.warn(`⚠️ Filter application test failed: ${error.message}`);
            }
        }
        
        return {
            validationPassed: validation.validationPassed,
            enabledMatches: validation.enabledMatches,
            applicationWorked
        };
    }

    /**
     * Runs a comprehensive filter test across all categories
     */
    async runCrossCategaryFilterAnalysis(filterName: string): Promise<{
        categoriesWithFilter: string[];
        universalFilter: boolean;
        categorySpecificBehavior: { [category: string]: any };
    }> {
        const categoryResults: { [category: string]: any } = {};
        const categoriesWithFilter: string[] = [];
        
        console.log(`\n📊 Running cross-category analysis for ${filterName} filter:`);
        
        for (const category of FilterTestData.categories) {
            try {
                // Setup category
                await this.setupCategorySearch(category.name);
                
                // Test if filter exists
                await this.searchResultPage.openFilter(filterName);
                const filterOptions = await this.searchResultPage.getFilterOptions(filterName);
                await this.searchResultPage.closeFilter();
                
                if (filterOptions.total > 0) {
                    categoriesWithFilter.push(category.name);
                    categoryResults[category.name] = {
                        available: true,
                        enabledOptions: filterOptions.enabled,
                        disabledOptions: filterOptions.disabled,
                        totalOptions: filterOptions.total
                    };
                    
                    console.log(`   ✅ ${category.name}: ${filterOptions.enabled.length} enabled, ${filterOptions.disabled.length} disabled`);
                } else {
                    categoryResults[category.name] = { available: false };
                    console.log(`   ❌ ${category.name}: Filter not available`);
                }
                
            } catch (error) {
                categoryResults[category.name] = { available: false, error: error.message };
                console.log(`   ❌ ${category.name}: Error testing filter - ${error.message}`);
            }
        }
        
        const universalFilter = categoriesWithFilter.length === FilterTestData.categories.length;
        
        console.log(`\n📋 Analysis Summary for ${filterName}:`);
        console.log(`   - Available in: ${categoriesWithFilter.join(', ')}`);
        console.log(`   - Universal filter: ${universalFilter ? 'Yes' : 'No'}`);
        
        return {
            categoriesWithFilter,
            universalFilter,
            categorySpecificBehavior: categoryResults
        };
    }

    /**
     * Tests filter performance across categories
     */
    async testFilterPerformance(filterName: string): Promise<{
        averageLoadTime: number;
        maxLoadTime: number;
        performancePassed: boolean;
        categoryResults: { [category: string]: number };
    }> {
        const loadTimes: { [category: string]: number } = {};
        let totalTime = 0;
        let maxTime = 0;
        
        console.log(`\n⚡ Testing performance for ${filterName} filter:`);
        
        for (const category of FilterTestData.categories) {
            try {
                await this.setupCategorySearch(category.name);
                
                const loadTime = await this.searchResultPage.measureFilterLoadTime(filterName);
                loadTimes[category.name] = loadTime;
                totalTime += loadTime;
                maxTime = Math.max(maxTime, loadTime);
                
                console.log(`   ${category.name}: ${loadTime}ms`);
                
            } catch (error) {
                console.log(`   ${category.name}: Performance test failed - ${error.message}`);
                loadTimes[category.name] = -1;
            }
        }
        
        const averageLoadTime = totalTime / Object.keys(loadTimes).length;
        const performancePassed = maxTime <= FilterTestData.performanceThresholds.filterLoadTime;
        
        console.log(`\n📊 Performance Summary for ${filterName}:`);
        console.log(`   - Average: ${averageLoadTime.toFixed(0)}ms`);
        console.log(`   - Maximum: ${maxTime}ms`);
        console.log(`   - Performance: ${performancePassed ? 'PASSED' : 'FAILED'}`);
        
        return {
            averageLoadTime,
            maxLoadTime: maxTime,
            performancePassed,
            categoryResults: loadTimes
        };
    }

    /**
     * Validates filter state persistence after page refresh
     */
    async testFilterPersistence(filterName: string, testOption: string): Promise<{
        persistenceWorked: boolean;
        urlPersisted: boolean;
        filterStillApplied: boolean;
    }> {
        console.log(`\n🔄 Testing filter persistence for ${filterName}:`);
        
        try {
            // Apply filter
            const applyResult = await this.searchResultPage.applyFilterAndValidate(
                filterName,
                testOption,
                { expectUrlUpdate: true }
            );
            
            if (!applyResult.applied) {
                throw new Error('Filter application failed');
            }
            
            const urlWithFilter = this.page.url();
            console.log(`   ✅ Applied filter, URL: ${urlWithFilter}`);
            
            // Refresh page
            await this.page.reload();
            await this.page.waitForLoadState('domcontentloaded');
            await this.page.waitForTimeout(3000);
            
            const urlAfterRefresh = this.page.url();
            const urlPersisted = urlAfterRefresh.includes('filter') || urlAfterRefresh.includes(testOption.toLowerCase());
            
            // Check if filter tag is still visible
            const filterStillApplied = await this.searchResultPage.isFilterTagVisible(testOption);
            
            console.log(`   📋 After refresh: URL persisted: ${urlPersisted}, Filter applied: ${filterStillApplied}`);
            
            return {
                persistenceWorked: urlPersisted && filterStillApplied,
                urlPersisted,
                filterStillApplied
            };
            
        } catch (error) {
            console.error(`   ❌ Persistence test failed: ${error.message}`);
            return {
                persistenceWorked: false,
                urlPersisted: false,
                filterStillApplied: false
            };
        }
    }

    /**
     * Generates a comprehensive test report for a filter
     */
    generateFilterTestReport(
        filterName: string,
        results: {
            crossCategoryAnalysis?: any;
            performanceResults?: any;
            persistenceResults?: any;
            validationResults?: { [category: string]: any };
        }
    ): string {
        let report = `\n🎯 COMPREHENSIVE TEST REPORT: ${filterName.toUpperCase()} FILTER\n`;
        report += `================================================================\n`;
        
        if (results.crossCategoryAnalysis) {
            report += `\n📊 CROSS-CATEGORY AVAILABILITY:\n`;
            report += `   - Available in: ${results.crossCategoryAnalysis.categoriesWithFilter.join(', ')}\n`;
            report += `   - Universal filter: ${results.crossCategoryAnalysis.universalFilter ? 'YES' : 'NO'}\n`;
        }
        
        if (results.performanceResults) {
            report += `\n⚡ PERFORMANCE ANALYSIS:\n`;
            report += `   - Average load time: ${results.performanceResults.averageLoadTime.toFixed(0)}ms\n`;
            report += `   - Maximum load time: ${results.performanceResults.maxLoadTime}ms\n`;
            report += `   - Performance status: ${results.performanceResults.performancePassed ? 'PASSED' : 'FAILED'}\n`;
        }
        
        if (results.persistenceResults) {
            report += `\n🔄 PERSISTENCE TESTING:\n`;
            report += `   - URL persistence: ${results.persistenceResults.urlPersisted ? 'PASSED' : 'FAILED'}\n`;
            report += `   - Filter state persistence: ${results.persistenceResults.filterStillApplied ? 'PASSED' : 'FAILED'}\n`;
            report += `   - Overall persistence: ${results.persistenceResults.persistenceWorked ? 'PASSED' : 'FAILED'}\n`;
        }
        
        if (results.validationResults) {
            report += `\n✅ VALIDATION RESULTS BY CATEGORY:\n`;
            Object.entries(results.validationResults).forEach(([category, result]: [string, any]) => {
                report += `   ${category}: ${result.validationPassed ? 'PASSED' : 'FAILED'} (${result.enabledCount || 0} options validated)\n`;
            });
        }
        
        report += `\n================================================================\n`;
        
        return report;
    }
}

export default FilterTestHelpers;
