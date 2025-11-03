import DeleteBooking from '../../page_objects/api/DeleteBookingsFunctions'
import GetBookings from '../../page_objects/api/GetBookingsFunctions'
import CreateBooking from '../../page_objects/api/CreateNewBookingFunction'

// IMPORTANT!!!!
// The test itself is reliable but the API is not. It doesn’t manage to delete all
// reservations in one run. There are always more reservations in the next run and
// the number is random. This is why this test is currently skipped even though
// it would be helpful to the overall reliability of the suite.

describe('DELETE all bookings', () => {
  let bookingId
  
  before(() => {
    // Step 1: Delete all existing bookings first
    DeleteBooking.deleteAllBookings()
      .then(() => {
        // Step 2: Create a new booking only after deletions finish
        const startDate = new Date()
        const checkOutDate = new Date(startDate)
        checkOutDate.setDate(startDate.getDate() + 30)
        const checkInDate = new Date(startDate)
        checkInDate.setDate(startDate.getDate() + 20)

        const params = {
          firstname: 'Pascal',
          lastname: 'Razvan',
          totalprice: 300,
          depositpaid: true,
          checkin: checkInDate,
          checkout: checkOutDate,
          additionalneeds: 'Breakfast'
        }

        return CreateBooking.createBooking(
          params.firstname,
          params.lastname,
          params.totalprice,
          params.depositpaid,
          params.checkin,
          params.checkout,
          params.additionalneeds
        )
      })
      .then((response) => {
        // Step 3: Validate booking creation
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('bookingid')
        expect(response.body.booking).to.include({
          firstname: 'Pascal',
          lastname: 'Razvan',
          totalprice: 300,
          depositpaid: true,
          additionalneeds: 'Breakfast'
        })
        bookingId = response.body.bookingid
      })
      .then(() => {
        // Step 4: Check the system state (optional)
        return GetBookings.getAllBookings().then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.be.an('array')
          expect(response.body).to.have.length(1)
        })
      })
  })

  it('should delete every booking in the system', () => {
    DeleteBooking.deleteAllBookings().then(() => {
      GetBookings.getAllBookings().then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        expect(response.body).to.have.length(0)
      })
    })
  })
})