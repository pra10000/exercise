import SharedUtilities from '../page_objects/e2e/SharedUtilities'
import ContactPage from '../page_objects/e2e/ContactPage'
import CommonErrorsInFormsPage from '../page_objects/e2e/CommonErrorsInFormsPage'

describe('Test booking form errors in various scenarios', () => {
    beforeEach(() => {
        cy.fixture('contact_form_default_values').as('contactData').then((data) => {})
        SharedUtilities.navigateToTestSiteAndCheckTheSiteUrlAndTitle()
    })
    
    it('Fill the contact form, send it and check confirmation', function() {
        const data = this.contactData
        ContactPage.fillAllInputs(data.name, data.email, data.phone, data.subject, data.message)
        ContactPage.clickSubmitButton()
        ContactPage.checkContactFormThankYouMessageIsVisible()
        //Check given name is on the screen
        SharedUtilities.checkGivenTextIsVisble(data.name)
        //Check given subject is on the screen
        SharedUtilities.checkGivenTextIsVisble(data.subject)
        ContactPage.checkWeWillGetBackToYouMessageIsVisible()
        ContactPage.checkAsSoonAsPossibleMessageIsVisible()
    })

    it('Check empty name error', function() {
        const data = this.contactData
        ContactPage.fillAllInputs("", data.email, data.phone, data.subject, data.message)
        ContactPage.clickSubmitButton()
        CommonErrorsInFormsPage.checkFieldMayNotBeBlankErrorMessageOfGivenFieldExistsAndIsVisible("Name")
    })

    it('Check empty email error', function() {
        const data = this.contactData
        ContactPage.fillAllInputs(data.name, "", data.phone, data.subject, data.message)
        ContactPage.clickSubmitButton()
        CommonErrorsInFormsPage.checkFieldMayNotBeBlankErrorMessageOfGivenFieldExistsAndIsVisible("Email")
    })

    it('Check empty phone error', function() {
        const data = this.contactData
        ContactPage.fillAllInputs(data.name, data.email, "", data.subject, data.message)
        ContactPage.clickSubmitButton()
        CommonErrorsInFormsPage.checkFieldMayNotBeBlankErrorMessageOfGivenFieldExistsAndIsVisible("Phone")
        CommonErrorsInFormsPage.checkGivenFieldSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible("Phone", 11, 21)
    })
    
    it('Check empty subject error', function() {
        const data = this.contactData
        ContactPage.fillAllInputs(data.name, data.email, data.phone, "", data.message)
        ContactPage.clickSubmitButton()
        CommonErrorsInFormsPage.checkFieldMayNotBeBlankErrorMessageOfGivenFieldExistsAndIsVisible("Subject")
        CommonErrorsInFormsPage.checkGivenFieldSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible("Subject", 5, 100)
    })

    it('Check empty message error', function() {
        const data = this.contactData
        ContactPage.fillAllInputs(data.name, data.email, data.phone, data.subject, "")
        ContactPage.clickSubmitButton()
        CommonErrorsInFormsPage.checkFieldMayNotBeBlankErrorMessageOfGivenFieldExistsAndIsVisible("Message")
        CommonErrorsInFormsPage.checkGivenFieldSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible("Message", 20, 2000)
    })

    it('Check empty form errors', function() {
        ContactPage.fillAllInputs("", "", "", "", "")
        ContactPage.clickSubmitButton()
        CommonErrorsInFormsPage.checkFieldMayNotBeBlankErrorMessageOfGivenFieldExistsAndIsVisible("Name")
        CommonErrorsInFormsPage.checkFieldMayNotBeBlankErrorMessageOfGivenFieldExistsAndIsVisible("Email")
        CommonErrorsInFormsPage.checkFieldMayNotBeBlankErrorMessageOfGivenFieldExistsAndIsVisible("Phone")
        CommonErrorsInFormsPage.checkGivenFieldSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible("Phone", 11, 21)
        CommonErrorsInFormsPage.checkFieldMayNotBeBlankErrorMessageOfGivenFieldExistsAndIsVisible("Subject")
        CommonErrorsInFormsPage.checkGivenFieldSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible("Subject", 5, 100)
        CommonErrorsInFormsPage.checkFieldMayNotBeBlankErrorMessageOfGivenFieldExistsAndIsVisible("Message")
        CommonErrorsInFormsPage.checkGivenFieldSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible("Message", 20, 2000)
    })

    it('Check error for wrong filled email', function() {
        const data = this.contactData
        ContactPage.fillAllInputs(data.name, "T", data.phone, data.subject, data.message)
        ContactPage.clickSubmitButton()
        CommonErrorsInFormsPage.checkEmailAddressWrongFormedErrorMessageShouldExist()
    })

    it('Check error for too short phone', function() {
        const data = this.contactData
        ContactPage.fillAllInputs(data.name, data.email , "071111", data.subject, data.message)
        ContactPage.clickSubmitButton()
        CommonErrorsInFormsPage.checkFieldMayNotBeBlankErrorMessageOfGivenFieldDoesNotExist("Phone")
        CommonErrorsInFormsPage.checkGivenFieldSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible("Phone", 11,21)
    })

    it('Check error for too long phone', function() {
        const data = this.contactData
        ContactPage.fillAllInputs(data.name, data.email , "0712345678012345678900", data.subject, data.message)
        ContactPage.clickSubmitButton()
        CommonErrorsInFormsPage.checkFieldMayNotBeBlankErrorMessageOfGivenFieldDoesNotExist("Phone")
        CommonErrorsInFormsPage.checkGivenFieldSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible("Phone", 11,21)
    })

    it('Check too short subject error', function() {
        const data = this.contactData
        ContactPage.fillAllInputs(data.name, data.email, data.phone, "Tes", data.message)
        ContactPage.clickSubmitButton()
        CommonErrorsInFormsPage.checkFieldMayNotBeBlankErrorMessageOfGivenFieldDoesNotExist("Subject")
        CommonErrorsInFormsPage.checkGivenFieldSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible("Subject", 5, 100)
    })

    it('Check too long subject error', function() {
        const data = this.contactData
        ContactPage.fillAllInputs(data.name, data.email, data.phone, 'T'.repeat(120), data.message)
        ContactPage.clickSubmitButton()
        CommonErrorsInFormsPage.checkFieldMayNotBeBlankErrorMessageOfGivenFieldDoesNotExist("Subject")
        CommonErrorsInFormsPage.checkGivenFieldSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible("Subject", 5, 100)
    })

    it('Check too short message error', function() {
        const data = this.contactData
        ContactPage.fillAllInputs(data.name, data.email, data.phone, data.subject, "Test message short")
        ContactPage.clickSubmitButton()
        CommonErrorsInFormsPage.checkFieldMayNotBeBlankErrorMessageOfGivenFieldDoesNotExist("Message")
        CommonErrorsInFormsPage.checkGivenFieldSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible("Message", 20, 2000)
    })

    it('Check too long message error', function() {
        const data = this.contactData
        ContactPage.fillAllInputs(data.name, data.email, data.phone, data.subject, 'T'.repeat(2020))
        ContactPage.clickSubmitButton()
        CommonErrorsInFormsPage.checkFieldMayNotBeBlankErrorMessageOfGivenFieldDoesNotExist("Message")
        CommonErrorsInFormsPage.checkGivenFieldSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible("Message", 20, 2000)
    })

    it('Check all are to short', function() {
        const data = this.contactData
        ContactPage.fillAllInputs(data.name, data.email, "0123", "test", "test")
        ContactPage.clickSubmitButton()
        CommonErrorsInFormsPage.checkFieldMayNotBeBlankErrorMessageOfGivenFieldDoesNotExist("Phone")
        CommonErrorsInFormsPage.checkGivenFieldSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible("Phone", 11,21)
        CommonErrorsInFormsPage.checkFieldMayNotBeBlankErrorMessageOfGivenFieldDoesNotExist("Subject")
        CommonErrorsInFormsPage.checkGivenFieldSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible("Subject", 5, 100)
        CommonErrorsInFormsPage.checkFieldMayNotBeBlankErrorMessageOfGivenFieldDoesNotExist("Message")
        CommonErrorsInFormsPage.checkGivenFieldSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible("Message", 20, 2000)
    })

    it('Check all are to long', function() {
        const data = this.contactData
        ContactPage.fillAllInputs(data.name, data.email, "0712345678012345678900", 'T'.repeat(120), 'T'.repeat(2020))
        ContactPage.clickSubmitButton()
        CommonErrorsInFormsPage.checkFieldMayNotBeBlankErrorMessageOfGivenFieldDoesNotExist("Phone")
        CommonErrorsInFormsPage.checkGivenFieldSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible("Phone", 11,21)
        CommonErrorsInFormsPage.checkFieldMayNotBeBlankErrorMessageOfGivenFieldDoesNotExist("Subject")
        CommonErrorsInFormsPage.checkGivenFieldSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible("Subject", 5, 100)
        CommonErrorsInFormsPage.checkFieldMayNotBeBlankErrorMessageOfGivenFieldDoesNotExist("Message")
        CommonErrorsInFormsPage.checkGivenFieldSizeErrorBetweenGivenMinimumAndMaximumExistsAndIsVisible("Message", 20, 2000)
    })
})