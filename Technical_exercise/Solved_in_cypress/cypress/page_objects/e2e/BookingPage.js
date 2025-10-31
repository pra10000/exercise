import SharedUtilities from './SharedUtilities'
import ReservationPage from './ReservationPage'


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

    GetPriceFromRoomCard(typeOfRoom){
        return cy.contains(typeOfRoom) 
            .parents('.card-body')             
            .siblings('.card-footer')           
            .contains('Book now')              
            .prev('div')                   
            .invoke('text')
            .then((rawText) => {
                return SharedUtilities.extractNumericValues(rawText)
            })
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

    bookGivenTypeOfRoomOnGivenInterval(typeOfRoom, checkInDate, checkOutDate, firstName, lastName, email, phone) {
        // 1️ Verify dates and set them
        SharedUtilities.verifyCheckInDateIsBeforeOrTheSameAsCheckOutDateAndThatWeUseRealValidFutureDates(checkInDate, checkOutDate)
        this.setCheckInDateAndCheckOutDate(checkInDate, checkOutDate)
        this.checkDateInsideDatePicker(this.CheckInDatePicker, checkInDate)
        this.checkDateInsideDatePicker(this.CheckOutDatePicker, checkOutDate)

        // 2️ Get the price from the room card
        this.GetPriceFromRoomCard(typeOfRoom).then((priceFromRoomCard) => {
            
            // 3️ Book the room and verify we're on the reservation page
            this.clickBookNowButtonOfGivenTypeOfRoom(typeOfRoom)
            cy.url().should('include', 'reservation')
            ReservationPage.checkBookThisRoomTitleExistsAndIsVisble()

            // 4️ Now get the price from the reservation page
            ReservationPage.GetPriceUnderBookThisRoom().then((priceFromReservationPage) => {
            
                // 5️ Finally compare the two prices
                expect(priceFromRoomCard).to.eq(priceFromReservationPage)
            })
        })

        // 6 Compare price with the price from summary price
        ReservationPage.GetPriceUnderBookThisRoom().then((priceUnderBookThisRoom) => {
            ReservationPage.GetPriceUnderPriceSummary().then((priceFromSummary) => {
                expect(priceUnderBookThisRoom).to.eq(priceFromSummary)
            })
        })

        // 7 Check number of days
        ReservationPage.GetNumberOfReservedDaysUnderPriceSummary().then((numberOfDays) => {
            expect(numberOfDays).to.eq(SharedUtilities.getNumberOfDays(checkInDate,checkOutDate))
        })

        //8 Check the total sum of money without fees
        ReservationPage.GetPriceUnderBookThisRoom().then((priceUnderBookThisRoom) => {
            ReservationPage.GetTotalWithoutFeesOfReservedDaysUnderPriceSummary().then((totalPriceWithoutFees) => {
                expect(totalPriceWithoutFees).to.eq(priceUnderBookThisRoom*SharedUtilities.getNumberOfDays(checkInDate,checkOutDate))
            })
        })

        //9 Check total with fees
        ReservationPage.GetTotalPriceWithFees().then((totalPrice) => {
            ReservationPage.GetTotalWithoutFeesOfReservedDaysUnderPriceSummary().then((totalPriceWithoutFees) => {
                ReservationPage.GetCleaningFee().then((cleaningFee) => {
                    ReservationPage.GetServiceFee().then((serviceFee) => {
                        expect(totalPrice).to.eq(totalPriceWithoutFees + cleaningFee + serviceFee)
                    })
                })
            })
        })

        // 10 Click Reserve Now button
        ReservationPage.clickReserveNowButton()

        // 11 Fill reservation form
        ReservationPage.fillFirstName(firstName)
        ReservationPage.fillLastName(lastName)
        ReservationPage.fillEmail(email)
        ReservationPage.fillPhone(phone)

        // 12 Click Reserve Now button and set intercept
        cy.intercept('POST', '/api/booking').as('postBooking')
        ReservationPage.clickReserveNowButtonWithoutId()

        // 13 Check post was triggered
        cy.wait('@postBooking').then((interception) => {
            expect(interception).to.not.be.null
        })
    }

    selectDate(targetDate) {
        const date = new Date(targetDate)
        const targetMonthYear = SharedUtilities.formatDate(date)
        const targetDayOfMonth = date.getDate()

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
            })
    }

    checkDateInsideDatePicker(input, dateToCheck){
        const dateParts = dateToCheck.split('-')
        // 2. Reorder the components to [Year, Month, Day] and join them with a forward slash
        // The order in the array is: [2], [1], [0]
        const dateSlashReordered = dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0]
        input.should('have.value', dateSlashReordered)
    }

    clickBookNowButtonOfGivenTypeOfRoom(typeOfRoom) {
        this.BookNowButtonOfGivenTypeOfRoom(typeOfRoom).click()
    }
}

export default new BookingPage();