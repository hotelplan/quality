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
     * Gets valid rating options (filters out non-numeric values)
     */
    async getValidRatingOptions(): Promise<string[]> {
        const filterOptions = await this.searchResultPage.getFilterOptions('Ratings');
        return filterOptions.enabled.filter(option => /^[1-5](\.[5])?$/.test(option));
    }

    /**
     * Tests a single filter option and validates results
     */
    async testSingleFilterOption(
        filterName: string, 
        optionValue: string, 
        expectResults: boolean = true
    ): Promise<{ success: boolean; resultCount: number; hasNoResults: boolean }> {
        try {
            // Apply the filter option
            await this.searchResultPage.selectFilterOption(filterName, optionValue, true);
            
            // Wait for results to update
            await this.page.waitForTimeout(3000);
            
            // Check results
            const hasNoResults = await this.searchResultPage.validateNoResultsMessage();
            const resultCount = hasNoResults ? 0 : await this.searchResultPage.getSearchResultCount();
            
            console.log(`✅ "${optionValue}" filter: ${hasNoResults ? 'No results' : `${resultCount} results`}`);
            
            return { success: true, resultCount, hasNoResults };
            
        } catch (error) {
            console.error(`❌ Failed testing "${optionValue}": ${error.message}`);
            return { success: false, resultCount: 0, hasNoResults: false };
        }
    }

    /**
     * Clears a filter option
     */
    async clearFilterOption(filterName: string, optionValue: string): Promise<void> {
        try {
            await this.searchResultPage.openFilter(filterName);
            const optionElement = this.page.locator(`text="${optionValue}"`).first();
            if (await optionElement.isVisible({ timeout: 3000 })) {
                await optionElement.click(); // Uncheck/unselect
            }
            await this.searchResultPage.applyFilter();
            await this.page.waitForTimeout(2000);
        } catch (error) {
            console.warn(`⚠️ Could not clear filter option "${optionValue}": ${error.message}`);
        }
    }
}

export default FilterTestHelpers;
