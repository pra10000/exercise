import DeleteBooking from '../../page_objects/api/DeleteBookingsFunctions'
import GetBookings from '../../page_objects/api/GetBookingsFunctions'
import CreateBooking from '../../page_objects/api/CreateNewBookingFunction'

describe('DELETE all bookings', () => {
  let bookingId

  before(() => {
    // Step 1: Delete all existing bookings
    return DeleteBooking.deleteAllBookings()
      .then(() => {
        // Step 2: Verify deletions
        return GetBookings.getAllBookings()
      })
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        // expect(response.body).to.have.length(0)

        // Step 3: Create a new booking
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
        // Step 4: Validate booking creation
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

        // Step 5: Optional system state check
        return GetBookings.getAllBookings()
      })
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        // expect(response.body).to.have.length(1)
      })
  })

  it.skip('should delete every booking in the system', () => {
    return DeleteBooking.deleteAllBookings()
      .then(() => {
        return GetBookings.getAllBookings()
      })
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        // expect(response.body).to.have.length(0)
      })
  })
})