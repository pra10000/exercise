import Auth from '../api/AuthFunction'
import GetBookings from '../api/GetBookingsFunctions'

//Commented because deletion through api is not reliable

class DeleteBooking {
  deleteBooking(bookingId, token) {
    const baseApiUrl = Cypress.env('baseApiUrl')
    return cy.request({
      method: 'DELETE',
      url: `${baseApiUrl}/booking/${bookingId}`,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`
      }
    })
  }

  deleteAllBookings() {
    return Auth.getAuthToken().then((authResponse) => {
      const token = authResponse.body.token

      return GetBookings.getAllBookings().then((getResponse) => {
        const bookings = getResponse.body
        cy.log(`Found ${bookings.length} bookings to delete`)

        if (!bookings.length) {
          cy.log('No bookings to delete.')
          return null
        }

        //return cy.then(() => {
         // return Cypress.Promise.each(bookings, (b) => {
            //return this.deleteBooking(b.bookingid, token).then((deleteResponse) => {
            //  cy.log(`Deleted booking ID: ${b.bookingid} (status ${deleteResponse.status})`)

              // Verify deletion using getBookingById
              //return GetBookings.getBookingById(b.bookingid).then((verifyResponse) => {
              //if (verifyResponse.status === 404) {
              //  cy.log(`Booking ID ${b.bookingid} successfully deleted`)
              //  } else {
              //  cy.log(`Booking ID ${b.bookingid} was NOT deleted (status ${verifyResponse.status})`)
              //  }
              //})
            //})
          //})
        //})
      })
    })
  }
}

export default new DeleteBooking()