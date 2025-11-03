class SharedUtilities {
    //Locators
    get MainPageTitle(){
        return cy.contains("Welcome to Shady Meadows B&B")
    }

    getGivenText(text){
        return cy.contains(text)
    }

    //Methods
    navigateToTestSite(){
        cy.visit('')
    }
    
    checkGivenTextIsVisble(text){
        this.getGivenText(text).should('be.visible')
    }

    checkTheUrlChangedToTheTestSite(){
        const baseUrlValue = Cypress.config('baseUrl');
        cy.url().should('eq', baseUrlValue + '/')
    }

    checkTheTestSiteLoadedTitle(){
        this.MainPageTitle.should('be.visible')
    }

    navigateToTestSiteAndCheckTheSiteUrlAndTitle()
    {
        this.navigateToTestSite()
        this.checkTheUrlChangedToTheTestSite()
        this.checkTheTestSiteLoadedTitle()
    }

    verifyCheckInDateIsBeforeOrTheSameAsCheckOutDateAndThatWeUseRealValidFutureDates(checkInDate,checkOutDate)
    {
        this.isFutureOrTodayValidDate(checkInDate)
        this.isFutureOrTodayValidDate(checkOutDate)
        this.verifyCheckInDateIsBeforeOrTheSameAsCheckoutDate(checkInDate,checkOutDate)
    }

    verifyCheckInDateIsBeforeOrTheSameAsCheckoutDate(checkInDate,checkOutDate)
    {
        const convertedToDateCheckInDate = new Date(checkInDate)
        const convertedToDateCheckOutDate = new Date(checkOutDate)
        const checkInTimestamp = convertedToDateCheckInDate.getTime()
        const checkOutTimestamp = convertedToDateCheckOutDate.getTime()
        expect(checkInTimestamp).to.be.lte(checkOutTimestamp,`Check-in date (${convertedToDateCheckInDate.toDateString()}) should be less than or equal to check-out date (${convertedToDateCheckOutDate.toDateString()}).`)
    }

    isFutureOrTodayValidDate(date) {
        this.isValidDate(date)
        this.isFutureDateOrToday(date)
    }

    isFutureDateOrToday(dateString) {
        // 1. Get the current date and set the time to midnight for a date-only comparison.
        const now = new Date();
        now.setHours(0, 0, 0, 0); 
        const nowTime = now.getTime();

        // 2. Parse the input date string.
        const dateToCheck = new Date(dateString);
        
        // 3. Set the input date's time to midnight for a fair comparison.
        dateToCheck.setHours(0, 0, 0, 0);

        // 4. Compare the times. `>=` means today or any day after.
        const result = dateToCheck.getTime() >= nowTime;

        expect(result, `'${dateString}' should be a date in the future or today.`).to.be.true;
    }

    isValidDate(dateString) {
        const dateToCheck = new Date(dateString) 
        const result = !isNaN(dateToCheck.getTime())
        // Check if the date object is valid (i.e., not 'Invalid Date')
        expect(result, `'${dateString}' should be a valid date.`).to.be.true
    }

    formatDate(date) {
        let d = new Date(date);
        let month = d.toLocaleString('default', { month: 'long' });
        let year = d.getFullYear();
        return `${month} ${year}`;
    }

    extractNumericValues(rawText) {
        const textLower = rawText.toLowerCase();

        // --- CASE 1: Check for the 'x' separator (e.g., "10x25" or "10 ft x 25 ft") ---
        if (textLower.includes('x')) {
            // Split by 'x' (case-insensitive) and map to trim
            const parts = rawText.split(/x/i).map(part => part.trim());

            if (parts.length === 2) {
                // Clean each part: keep only digits (all non-digits are removed for INT parsing)
                const cleanPart1 = parts[0].replace(/[^0-9]/g, '')
                const cleanPart2 = parts[1].replace(/[^0-9]/g, '')

                // Convert to integers
                const int1 = parseInt(cleanPart1, 10)
                const int2 = parseInt(cleanPart2, 10)

                // Validate both numbers are valid
                if (!isNaN(int1) && !isNaN(int2)) {
                    // Return two integers in an array
                    return [int1, int2]
                }
            }
        }

        // --- CASE 2: Fallback to single price extraction (original logic, allowing decimals) ---
        // Clean the text to keep only digits (0-9) AND the decimal point (.).
        const priceString = rawText.replace(/[^0-9.]/g, '')

        if (priceString && priceString.length > 0) {
            // Convert the cleaned string to a floating-point number (keeps decimals)
            const priceNumber = parseFloat(priceString)

            // Validate that the conversion resulted in a valid number
            if (!isNaN(priceNumber)) {
                return priceNumber
            }
        }

        // --- CASE 3: Fallback (Failure) ---
        cy.log(`❌ Error: Numeric price or dimensions not found. Raw text: ${rawText}`);
        throw new Error("Failed to extract numeric values from the element text. Expected format: \"\\d+\" or \"\\d+x\\d+\"");
    }

    getNumberOfDays(startDate, endDate) {
        const date1 = new Date(startDate)
        const date2 = new Date(endDate)
        
        // Constant for milliseconds in one day
        const ONE_DAY_MS = 1000 * 60 * 60 * 24

        // Check for invalid dates
        if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
            cy.log(`❌ Error: Invalid date format provided. Start: ${startDate}, End: ${endDate}`)
            throw new Error("Invalid date format. Please provide valid start and end dates.")
        }

        // Calculate the difference in milliseconds
        const differenceMs = date2.getTime() - date1.getTime()

        // Convert to days and round to handle potential daylight saving time shifts cleanly
        const days = Math.round(differenceMs / ONE_DAY_MS)
        
        return days
    }
}

export default new SharedUtilities();