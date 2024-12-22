class FlightSearch {
    constructor(page) {
        this.page = page
        this.segment = page.locator('.mb-1')

    }
    async triptype(data) {
        if (data.airTravelType != "OneWay") {
            const triptypefield = this.page.locator('.trip-type-select-width')
            await triptypefield.click()
            await this.page.waitForTimeout(1000)
            await this.page.locator(`li[data-value="${data.airTravelType}"]`).click();
        }
    }
    async origindestination(data, i) {
        let origin, originData, destination, destinationData;
        origin = this.page.locator('[title="Leaving From"]').nth(i);
        originData = this.page.locator('[placeholder="Search Origin"]').nth(i);
        destination = this.page.locator('[title="Going To"]').nth(i);
        destinationData = this.page.locator('[placeholder="Search Destination"]').nth(i); // Destination next to origin
        await origin.click({ force: true })
        console.log("origin clicked")
        await originData.fill(data.originDestinations[0].origin);//bracket notation
        await this.page.waitForSelector(`div.destination-code:has-text("${data.originDestinations[0].origin}")`);
        await this.page.locator(`div.destination-code:has-text("${data.originDestinations[0].origin}")`).click();
        await destination.click();
        await destinationData.fill(data.originDestinations[0].destination); //bracket notation
        await this.page.waitForSelector(`div.destination-code:has-text("${data.originDestinations[0].destination}")`);
        await this.page.locator(`div.destination-code:has-text("${data.originDestinations[0].destination}")`).click();
        console.log("working")
        await this.page.waitForTimeout(1000)
        const addItineraryfield = this.page.locator('text="ADD ANOTHER CITY"')
        console.log(`This is  the value of i is ${i}`)
        if (await addItineraryfield.isVisible()) {
            await addItineraryfield.click()
        }
    }
    async paxcount(data) {
        if (data.adultCount == 1 && data.childCount == 0 && data.infantCount == 0) {
            return;
        }
        else {
            await this.page.locator('.pax-text').click();
            await this.page.waitForTimeout(2000);
            if (data.adultCount > 1) {
                for (let i = 1; i < data.adultCount; i++) {
                    console.log(`Clicking to add adult: ${i}`);
                    await this.page.locator('[title="Add"]').nth(0).click();
                    await this.page.mouse.move(200, 200)
                }
            }
            if (data.childCount > 0) {
                for (let i = 1; i <= data.childCount; i++) {
                    await this.page.locator('[title="Add"]').nth(1).click();
                    await this.page.mouse.move(200, 200)
                }
            }
            if (data.infantCount > 0) {
                for (let i = 1; i <= data.infantCount; i++) {
                    await this.page.locator('[title="Add"]').nth(2).click();
                    await this.page.mouse.move(200, 200)
                }
            }
            await this.page.locator('.pax-text').click({ force: true });
        }
    }
    async cabinSelect(data) {
        if (data.cabinClass != "Economy") {
            await this.page.getByRole('button', { name: 'Economy' }).click();
            await this.page.waitForTimeout(2000);
            await this.page.locator(`li[data-value=${data.cabinClass}]`).click();//data value attribute
            console.log("Cabin selected")
            await this.page.waitForTimeout(2000);
        }
    }
    async pickRandomEnabledDate(data) {
        let existDate;
        const departuredate = this.page.locator('div.MuiGrid-root.pl-16.br-1.hover-fill.MuiGrid-item.MuiGrid-grid-xs-3:has(div.bold:has-text("DEPART"))')
        await departuredate.click();
        console.log("Entering a function");
        let monthlocator;
        const randomNext = Math.floor(Math.random() * 6)
        if (randomNext != 0) {
            for (let i = 1; i <= randomNext; i++) {
                await this.page.locator('[name="next-month"]').click()
            }
        }
        const randomMonth = Math.floor(Math.random() * 2)
        if (randomMonth == 0) {
            monthlocator = this.page.locator('.rdp-month.rdp-caption_start');
        }
        else if (randomMonth == 1) {
            monthlocator = this.page.locator('.rdp-month.rdp-caption_end');
        }
        await this.page.waitForSelector('.rdp-month.rdp-caption_start');
        const validDateButtons = monthlocator.locator('.rdp-button_reset.rdp-button.rdp-day:not(.rdp-day_disabled)');
        const count = await validDateButtons.count();
        console.log("count Value ", count);
        if (count > 0) {
            const randomIndex = Math.floor(Math.random() * count);
            console.log("Randomly index ", randomIndex);
            await validDateButtons.nth(randomIndex).click();
            const dateCaptured = await this.page.locator('.station-text').nth(2).textContent();

            //   data.originDestinations[0].departureDateTime = existDate

        } else {
            console.log("No valid date bu ttons found to pick from.");
        }
        const dateCaptured = await this.page.locator('.station-text').nth(2).textContent();
        //console.log(data)
        existDate = data.originDestinations[0].departureDateTime
        console.log(existDate)
        existDate = await this.convertToDate(dateCaptured)
        data.originDestinations[0].departureDateTime = existDate;
        console.log(existDate)
        console.log(data)

        return data;
    }

    async convertToDate(dateCaptured) {
        // Define month abbreviations and their corresponding month numbers
        const months = {
            "Jan": 1,
            "Feb": 2,
            "Mar": 3,
            "Apr": 4,
            "May": 5,
            "Jun": 6,
            "Jul": 7,
            "Aug": 8,
            "Sep": 9,
            "Oct": 10,
            "Nov": 11,
            "Dec": 12
        };

        // Extract the month abbreviation
        const monthStr = dateCaptured.match(/[A-Za-z]+/)[0];  // Extract month abbreviation

        // Extract day (the number before the month abbreviation)
        const day = parseInt(dateCaptured.slice(0, dateCaptured.indexOf(monthStr)));  // Slice from 0 to the start of the month

        // Extract year (last two characters)
        const year = "20" + dateCaptured.slice(-2);

        // Convert the month abbreviation to month number
        const month = months[monthStr];

        // Format the date in YYYY-MM-DD
        const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        return formattedDate;
    }
    async stopOver(data) {
        if (data.stopOver == "DirectFlight") {
            await this.page.locator('.jss41').nth(1).click()
        }
        else {
            return;
        }
    }
    async brandedFares(data) {
        if (data.IsBrandFareEnable == false) {
            await this.page.locator('.jss41').nth(2).click()
        }
        else {
            return;
        }
    }
    async includecarrier(data) {
        const carrier = data.includeCarrier.split(",").map(c => c.trim().toUpperCase()); // Split, trim, and convert each carrier to uppercase
        await this.page.locator('.pax-dropdown').nth(1).click(); // Click to open the dropdown

        for (let i = 0; i < carrier.length; i++) {
            await this.page.locator('[id="ex airline select"]').fill(carrier[i]);
            await this.page.locator('[id="ex airline select"]').press('Enter');
            await this.page.locator(`text=${carrier[i]}`).click();
        }
    }

    async searchfunction(data) {
        for (let i = 0; i < 6; i++) {
            const segmentfield = this.page.locator('.mb-1')
            console.log(`This is  the value of i is ${i}`)
            if (await segmentfield.nth(i).isVisible()) {
                await this.origindestination(data, i)
                if (i == 0) {
                    await this.triptype(data)
                    console.log("lo0p to select the trip")
                    await this.page.waitForTimeout(2000)
                    await this.paxcount(data)
                    await this.page.waitForTimeout(2000)
                    await this.cabinSelect(data)
                    await this.page.waitForTimeout(2000)
                    await this.pickRandomEnabledDate(data)
                    await this.page.waitForTimeout(2000)
                    await this.stopOver(data)
                    await this.page.waitForTimeout(2000)
                    await this.brandedFares(data)
                    await this.page.waitForTimeout(2000)
                    await this.includecarrier(data)
                }
                await this.page.waitForTimeout(2000)
            }
            else {
                return data;
            }
        }

    }
}
export default FlightSearch;