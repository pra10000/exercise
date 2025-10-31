import SharedUtilities from './SharedUtilities';

class BookingPage {
    //Locators
    get CheckInDatePicker(){
        return cy.contains('label', 'Check In').next('div').find('input')
    }

    get CheckOutDatePicker(){
        return cy.contains('label', 'Check Out').next('div').find('input')
    }

    get CurrentMonthYear() {
        return cy.get('[aria-label="Choose Date"]').find('h2').invoke('text').then(currentMonthYear => currentMonthYear.trim())
    }

    get NextMonthButton(){
        return cy.get('[aria-label="Next Month"]')
    }

    get PreviousMonthButton(){
        return cy.get('[aria-label="Previous Month"]')
    }

    get ChooseDateDialog(){
        return cy.get('[aria-label="Choose Date"]', { timeout: 5000 })
    }

    BookNowButtonOfGivenTypeOfRoom(typeOfRoom){
        return cy.get('.card-title')
                .contains(typeOfRoom) 
                // Navigate up to the main card container (a div with class 'card' or 'room-card')
                .parents('.card') 
                // Find the 'Book now' link specifically within this card's context
                .contains('Book now') 
                // Click
                .click()
    }

    ListOfDates(targetDayOfMonth, targetDate) {
        // 1. Get the month name (e.g., "December") from the targetDate
        const date = new Date(targetDate);
        const targetMonthName = date.toLocaleString('default', { month: 'long' });
        
        // 2. Construct a regular expression that matches the day and the month name
        // This looks for an element containing the day number text (e.g., '1')
        // AND that has an aria-label containing the target month name (e.g., 'December').
        
        return cy.get('[role="listbox"]')
                // Filter those elements to ensure their aria-label contains the target month name.
                // This is the key step to exclude outside-month dates.
                .find(`[aria-label*="${targetMonthName}"]`)
                // Find elements that contain the day number text (e.g., '1')
                .contains(new RegExp(`^${targetDayOfMonth}$`)) 
    }

    //Methods
    clickCheckInDatePicker(){
        this.CheckInDatePicker.click()
    }

    clickCheckOutDatePicker(){
        this.CheckOutDatePicker.click()
    }

    selectCheckInDate(checkInDate){
        this.clickCheckInDatePicker()
        this.selectDate(checkInDate)
    }

    selectCheckOutDate(checkOutDate){
        this.clickCheckOutDatePicker()
        this.selectDate(checkOutDate)
    }

    setCheckInDateAndCheckOutDate(checkInDate,checkOutDate){
        SharedUtilities.verifyCheckInDateIsBeforeOrTheSameAsCheckoutDate(checkInDate,checkOutDate)
        this.selectCheckInDate(checkInDate)
        this.selectCheckOutDate(checkOutDate)
    }

    bookGivenTypeOfRoomOnGivenInterval(typeOfRoom,checkInDate,checkOutDate){
        SharedUtilities.verifyCheckInDateIsBeforeOrTheSameAsCheckOutDateAndThatWeUseRealValidFutureDates(checkInDate,checkOutDate)
        this.setCheckInDateAndCheckOutDate(checkInDate,checkOutDate)
        this.BookNowButtonOfGivenTypeOfRoom(typeOfRoom)

    }

    formatDate(date) {
        let d = new Date(date);
        let month = d.toLocaleString('default', { month: 'long' });
        let year = d.getFullYear();
        return `${month} ${year}`;
    }

    selectDate(targetDate) {
        const date = new Date(targetDate);
        const targetMonthYear = this.formatDate(date);
        const targetDayOfMonth = date.getDate();

        const navigate = () => {
            return this.CurrentMonthYear.then((currentMonthYear) => {
                if (currentMonthYear !== targetMonthYear) {
                    // Determine navigation direction based on the current date displayed
                    const targetDateTime = date.setHours(0, 0, 0, 0);
                    const currentDisplayedMonth = new Date(currentMonthYear);
                    
                    // Simple logic for navigating forward/backward
                    // If target is AFTER the current displayed month, click Next. Otherwise, click Previous.
                    const isTargetAfterDisplayed = targetDateTime > currentDisplayedMonth.setHours(0, 0, 0, 0);

                    const buttonSelector = isTargetAfterDisplayed
                        ? this.NextMonthButton
                        : this.PreviousMonthButton

                    // Clicks the button, and then recursively calls navigate() in the promise chain
                    return buttonSelector.click().then(navigate);
                }
                // When currentMonthYear === targetMonthYear, the recursion stops.
                return currentMonthYear
            });
        };

        // 1. Start navigation (after the date picker is open)
        // Ensure the date picker is open before starting navigation
        this.ChooseDateDialog.should('be.visible').then(navigate)
            // 2. Once the correct month is visible, click the day number.
            .then(() => {
                this.ListOfDates(targetDayOfMonth,targetDate).click()
            });
    }
}

export default new BookingPage();