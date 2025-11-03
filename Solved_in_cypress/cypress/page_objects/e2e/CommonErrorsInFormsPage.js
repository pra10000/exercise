class CommonErrorsInFormsPage {
   
   //Locators
    get EmptyErrorMessage(){
        return cy.get('li:contains("must not be empty")', { includeHidden: true })
    }

    get EmailAddressWrongFormedErrorMessage(){
        return cy.contains('must be a well-formed email address')
    }

    getSizeErrorMessageTextWithGivenMinimumAndMaximum(minimum, maximum){
        return cy.contains(`size must be between ${minimum} and ${maximum}`)
    }

    getGivenFieldSizeErrorMessageTextWithGivenMinimumAndMaximum(field, minimum, maximum){
        return cy.contains(`${field} must be between ${minimum} and ${maximum} characters`)
    }

    getFieldShouldNotBeBlankErrorMessageOfGivenField(field){
        return cy.contains(`${field} should not be blank`)
    }

    getFieldMayNotBeBlankErrorMessageOfGivenField(field){
        return cy.contains(`${field} may not be blank`)
    }

    //Methods
    checkEmptyErrorsNumberVisibleOnTheScreen(expectedCount) {
        this.EmptyErrorMessage
            .filter(':visible')
            .should('have.length', expectedCount);
    }

    checkEmptyErrorsNumberVisibleDoesntExist(){
        this.EmptyErrorMessage.should('not.exist')
    }

    checkSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible(minimum,maximum) {
        this.getSizeErrorMessageTextWithGivenMinimumAndMaximum(minimum, maximum).should('exist').and('be.visible')
    }

    checkGivenFieldSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible(field, minimum,maximum) {
        this.getGivenFieldSizeErrorMessageTextWithGivenMinimumAndMaximum(field, minimum, maximum).should('exist').and('be.visible')
    }

    checkFieldShouldNotBeBlankErrorMessageOfGivenFieldExistsAndIsVisible(field) {
        this.getFieldShouldNotBeBlankErrorMessageOfGivenField(field).should('exist').and('be.visible')
    }

    checkFieldMayNotBeBlankErrorMessageOfGivenFieldExistsAndIsVisible(field) {
        this.getFieldMayNotBeBlankErrorMessageOfGivenField(field).should('exist').and('be.visible')
    }

    checkFieldMayNotBeBlankErrorMessageOfGivenFieldDoesNotExist(field) {
        this.getFieldMayNotBeBlankErrorMessageOfGivenField(field).should('not.exist')
    }

    checkFieldShouldNotBeBlankErrorMessageOfGivenFieldDoesntExist(field) {
        this.getFieldShouldNotBeBlankErrorMessageOfGivenField(field).should('not.exist')
    }

    checkEmailAddressWrongFormedErrorMessageShouldExist(){
        this.EmailAddressWrongFormedErrorMessage.should('exist')
    }
}

export default new CommonErrorsInFormsPage()