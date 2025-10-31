class SharedUtilities {
    //Locators
    get MainPageTitle(){
        return cy.contains("Welcome to Shady Meadows B&B")
    }

    //Methods
    navigateToTestSite(){
        cy.visit('')
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
}

export default new SharedUtilities();