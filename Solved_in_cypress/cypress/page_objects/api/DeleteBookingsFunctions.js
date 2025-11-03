import Auth from '../api/AuthFunction'
import GetBookings from '../api/GetBookingsFunctions'

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
  // Step 1: Get auth token
  return Auth.getAuthToken().then((authResponse) => {
    const token = authResponse.body.token;

    // Step 2: Get all booking IDs
    return GetBookings.getAllBookings().then((getResponse) => {
      const bookings = getResponse.body;
      cy.log(`Found ${bookings.length} bookings to delete`);

      if (!bookings.length) {
        cy.log('No bookings to delete.');
        return;
      }

      // Step 3: Delete each booking sequentially -COMMENTED BECAUSE THE SYSTEM IS NOT RELIABLE YET, IT DOESN'T DELETE ALL ENTRIES, AT EACH RUN WE HAVE A RANDOM NUMBER OF ENTRIES TO DELETE
      //bookings.forEach((b) => {
      //  this.deleteBooking(b.bookingid, token).then((deleteResponse) => {
      //    cy.log(`Deleted booking ID: ${b.bookingid} (status ${deleteResponse.status})`);
      //  })
      //})
    })
  })
}
}

export default new DeleteBooking()