#!/usr/bin/env node

/**
 * Comprehensive App Testing System
 * Tests all pages, images, functionality, and detects errors
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:3000';
const TEST_TIMEOUT = 30000;
const SCREENSHOT_DIR = './test-screenshots';

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Test configuration - all pages to test
const TEST_PAGES = [
  // Main pages
  { path: '/', name: 'Homepage', critical: true },
  { path: '/activities', name: 'Activities List', critical: true },
  { path: '/about', name: 'About Page', critical: false },
  { path: '/blog', name: 'Blog Page', critical: false },
  { path: '/contact', name: 'Contact Page', critical: false },
  
  // User pages  
  { path: '/bookings', name: 'My Bookings', critical: true, requiresAuth: true },
  { path: '/wishlist', name: 'Wishlist', critical: true, requiresAuth: true },
  { path: '/profile', name: 'User Profile', critical: true, requiresAuth: true },
  
  // Admin pages
  { path: '/admin/dashboard', name: 'Admin Dashboard', critical: true, requiresAuth: true },
  { path: '/admin/activities', name: 'Admin Activities', critical: true, requiresAuth: true },
  { path: '/admin/bookings', name: 'Admin Bookings', critical: true, requiresAuth: true },
  
  // Debug/Test pages
  { path: '/debug', name: 'Debug Page', critical: false },
  { path: '/populate-activities', name: 'Populate Activities', critical: false }
];

class AppTester {
  constructor() {
    this.browser = null;
    this.results = {
      totalPages: 0,
      passedPages: 0,
      failedPages: 0,
      warnings: 0,
      errors: [],
      pageResults: [],
      imageErrors: [],
      performanceIssues: [],
      startTime: new Date()
    };
  }

  async initialize() {
    console.log('🚀 Initializing Comprehensive App Tester...\n');
    
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
      console.log('✅ Browser launched successfully');
    } catch (error) {
      console.error('❌ Failed to launch browser:', error.message);
      throw error;
    }
  }

  async testPage(pageConfig) {
    const page = await this.browser.newPage();
    const result = {
      name: pageConfig.name,
      path: pageConfig.path,
      status: 'unknown',
      loadTime: 0,
      errors: [],
      warnings: [],
      images: { total: 0, loaded: 0, failed: 0 },
      consoleErrors: [],
      performanceMetrics: {},
      screenshot: null
    };

    try {
      console.log(`🔍 Testing: ${pageConfig.name} (${pageConfig.path})`);

      // Set up error monitoring
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      page.on('pageerror', error => {
        result.errors.push(`Page Error: ${error.message}`);
      });

      page.on('requestfailed', request => {
        result.warnings.push(`Failed Request: ${request.url()} - ${request.failure().errorText}`);
      });

      // Start performance monitoring
      const startTime = Date.now();
      
      // Navigate to page
      const response = await page.goto(`${BASE_URL}${pageConfig.path}`, {
        waitUntil: 'networkidle0',
        timeout: TEST_TIMEOUT
      });

      const loadTime = Date.now() - startTime;
      result.loadTime = loadTime;

      // Check if page loaded successfully
      if (!response || response.status() >= 400) {
        result.status = 'failed';
        result.errors.push(`HTTP ${response?.status()}: Page failed to load`);
        return result;
      }

      // Wait for page to be fully rendered
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Test images
      const imageResults = await this.testImages(page);
      result.images = imageResults;

      // Get performance metrics
      const performanceMetrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          totalLoadTime: navigation.loadEventEnd - navigation.fetchStart
        };
      });
      result.performanceMetrics = performanceMetrics;

      // Take screenshot
      const screenshotPath = path.join(SCREENSHOT_DIR, `${pageConfig.name.replace(/\s+/g, '-').toLowerCase()}.png`);
      await page.screenshot({ 
        path: screenshotPath, 
        fullPage: true,
        capture: 'viewport'
      });
      result.screenshot = screenshotPath;

      // Check for specific content indicators
      const contentChecks = await this.checkPageContent(page, pageConfig);
      result.warnings.push(...contentChecks.warnings);

      // Add console errors
      result.consoleErrors = consoleErrors;

      // Determine overall status
      if (result.errors.length === 0 && consoleErrors.length === 0) {
        result.status = result.warnings.length > 0 ? 'warning' : 'passed';
      } else {
        result.status = 'failed';
      }

      console.log(`   ${this.getStatusIcon(result.status)} Load time: ${loadTime}ms`);
      console.log(`   📸 Images: ${result.images.loaded}/${result.images.total} loaded`);
      if (result.errors.length > 0) {
        console.log(`   ❌ Errors: ${result.errors.length}`);
      }
      if (result.warnings.length > 0) {
        console.log(`   ⚠️  Warnings: ${result.warnings.length}`);
      }
      console.log('');

    } catch (error) {
      result.status = 'failed';
      result.errors.push(`Test Error: ${error.message}`);
      console.log(`   ❌ Test failed: ${error.message}\n`);
    } finally {
      await page.close();
    }

    return result;
  }

  async testImages(page) {
    const imageResults = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      const results = {
        total: images.length,
        loaded: 0,
        failed: 0,
        details: []
      };

      images.forEach((img, index) => {
        const detail = {
          src: img.src,
          alt: img.alt || 'No alt text',
          loaded: img.complete && img.naturalHeight !== 0,
          visible: img.offsetWidth > 0 && img.offsetHeight > 0
        };

        if (detail.loaded) {
          results.loaded++;
        } else {
          results.failed++;
        }

        results.details.push(detail);
      });

      return results;
    });

    return imageResults;
  }

  async checkPageContent(page, pageConfig) {
    const warnings = [];

    try {
      // Check for common elements
      const hasHeader = await page.$('header, nav') !== null;
      const hasFooter = await page.$('footer') !== null;
      const hasMainContent = await page.$('main, .main-content, #main') !== null;

      if (!hasHeader) warnings.push('No header/navigation found');
      if (!hasFooter) warnings.push('No footer found');
      if (!hasMainContent) warnings.push('No main content area found');

      // Page-specific checks
      if (pageConfig.path === '/activities') {
        const activityCards = await page.$$('.activity-card, [data-testid="activity-card"]');
        if (activityCards.length === 0) {
          warnings.push('No activity cards found on activities page');
        }
      }

      if (pageConfig.path === '/') {
        const heroSection = await page.$('.hero, [data-testid="hero"]');
        if (!heroSection) {
          warnings.push('No hero section found on homepage');
        }
      }

    } catch (error) {
      warnings.push(`Content check failed: ${error.message}`);
    }

    return { warnings };
  }

  getStatusIcon(status) {
    switch (status) {
      case 'passed': return '✅';
      case 'warning': return '⚠️';
      case 'failed': return '❌';
      default: return '❓';
    }
  }

  async runAllTests() {
    console.log('🧪 Starting comprehensive testing of all pages...\n');
    
    this.results.totalPages = TEST_PAGES.length;

    for (const pageConfig of TEST_PAGES) {
      const result = await this.testPage(pageConfig);
      this.results.pageResults.push(result);

      if (result.status === 'passed') {
        this.results.passedPages++;
      } else if (result.status === 'warning') {
        this.results.warnings++;
      } else {
        this.results.failedPages++;
        this.results.errors.push(...result.errors);
      }

      // Collect image errors
      if (result.images.failed > 0) {
        this.results.imageErrors.push({
          page: pageConfig.name,
          failedImages: result.images.failed,
          totalImages: result.images.total
        });
      }

      // Collect performance issues
      if (result.loadTime > 5000) {
        this.results.performanceIssues.push({
          page: pageConfig.name,
          loadTime: result.loadTime
        });
      }
    }
  }

  generateReport() {
    const endTime = new Date();
    const duration = (endTime - this.results.startTime) / 1000;

    console.log('\n' + '='.repeat(60));
    console.log('📊 COMPREHENSIVE TEST REPORT');
    console.log('='.repeat(60));
    console.log(`🕐 Test Duration: ${duration.toFixed(1)} seconds`);
    console.log(`📄 Total Pages Tested: ${this.results.totalPages}`);
    console.log(`✅ Passed: ${this.results.passedPages}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}`);
    console.log(`❌ Failed: ${this.results.failedPages}`);
    console.log('');

    // Page-by-page results
    console.log('📋 DETAILED RESULTS:');
    console.log('-'.repeat(40));
    this.results.pageResults.forEach(result => {
      console.log(`${this.getStatusIcon(result.status)} ${result.name}`);
      console.log(`   Path: ${result.path}`);
      console.log(`   Load Time: ${result.loadTime}ms`);
      console.log(`   Images: ${result.images.loaded}/${result.images.total}`);
      
      if (result.errors.length > 0) {
        console.log(`   Errors: ${result.errors.join(', ')}`);
      }
      if (result.warnings.length > 0) {
        console.log(`   Warnings: ${result.warnings.length} found`);
      }
      if (result.consoleErrors.length > 0) {
        console.log(`   Console Errors: ${result.consoleErrors.length}`);
      }
      console.log('');
    });

    // Summary of issues
    if (this.results.imageErrors.length > 0) {
      console.log('🖼️  IMAGE ISSUES:');
      this.results.imageErrors.forEach(issue => {
        console.log(`   ${issue.page}: ${issue.failedImages}/${issue.totalImages} images failed`);
      });
      console.log('');
    }

    if (this.results.performanceIssues.length > 0) {
      console.log('🐌 PERFORMANCE ISSUES:');
      this.results.performanceIssues.forEach(issue => {
        console.log(`   ${issue.page}: ${issue.loadTime}ms (slow)`);
      });
      console.log('');
    }

    // Overall status
    console.log('🎯 OVERALL STATUS:');
    if (this.results.failedPages === 0) {
      if (this.results.warnings === 0) {
        console.log('✅ ALL TESTS PASSED - App is ready for production!');
      } else {
        console.log('⚠️  ALL TESTS PASSED WITH WARNINGS - App is mostly ready');
      }
    } else {
      console.log('❌ SOME TESTS FAILED - Issues need to be addressed');
    }

    console.log(`\n📸 Screenshots saved to: ${SCREENSHOT_DIR}`);
    console.log('='.repeat(60));

    // Save report to file
    const reportPath = './test-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`📄 Detailed report saved to: ${reportPath}`);
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      console.log('\n🧹 Browser closed and cleanup completed');
    }
  }

  async run() {
    try {
      await this.initialize();
      await this.runAllTests();
      this.generateReport();
    } catch (error) {
      console.error('❌ Testing failed:', error);
      this.results.errors.push(`System Error: ${error.message}`);
    } finally {
      await this.cleanup();
    }
  }
}

// Check if Puppeteer is installed
async function checkDependencies() {
  try {
    require('puppeteer');
    return true;
  } catch (error) {
    console.log('❌ Puppeteer not found. Installing...');
    console.log('Run: npm install puppeteer');
    return false;
  }
}

// Main execution
async function main() {
  const hasDepencies = await checkDependencies();
  if (!hasDepencies) {
    process.exit(1);
  }

  const tester = new AppTester();
  await tester.run();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = AppTester;