import { test, expect, chromium } from '@playwright/test';
import Signin from '../pages/signIn.js';
import SearchAPIInputData from '../Json/SearchAPIInputData.json';
import Logindata from '../Json/logindata.json';
import FlightSearch from '../pages/flights.js';
import SearchResultPage from '../pages/SearchResultsPage.js';
import Searchapi from '../pages/SearchAPI.js';
import { request } from 'http';

let browser, context, page;

test.beforeAll(async ({request}) => {
  test.setTimeout(600000);

  // Launch browser and set up context/page
  browser = await chromium.launch({ headless: false });
  context = await browser.newContext();
  page = await context.newPage();

  // Perform login actions
  const signinPage = new Signin(page,request);
  await signinPage.navigatetopage();
  await expect(page).toHaveTitle("Get Fares - Same Flights Lowest Fares");
  await signinPage.logincredentials(Logindata.Username, Logindata.Password);

  // Wait for loader and complete OTP process
  await expect(page.locator('.loader-box-content')).toBeHidden({ timeout: 30000 });
  await signinPage.otpfunction();
  await expect(page).toHaveURL('https://uat.getfares.com/flight', { timeout: 600000 });
});

test.afterAll(async () => {
 
  await browser.close();
});

test.describe('Flight Search Tests',() => {
  SearchAPIInputData.forEach((data) => {
    test("This is a test", async ({request}) => {
      test.setTimeout(600000);
      const search = new FlightSearch(page);
      await search.searchfunction(data);
      console.log(data);
      const APIsearch = new Searchapi(request)
      await APIsearch.SearchApiResponse(data)
      const searchResult = new SearchResultPage(page);
      await searchResult.SearchResults();
    });
  });
});
