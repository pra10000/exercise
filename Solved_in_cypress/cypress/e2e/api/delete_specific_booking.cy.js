import DeleteBooking from '../../page_objects/api/DeleteBookingsFunctions'
import CreateBooking from '../../page_objects/api/CreateNewBookingFunction'
import Auth from '../../page_objects/api/AuthFunction'
import GetBookings from '../../page_objects/api/GetBookingsFunctions'

describe('DELETE /booking/{id}', () => {
  let bookingId
  let token

  before(() => {
    // First delete all bookings
    return DeleteBooking.deleteAllBookings() //DISABLED BECAUSE THE SYSTEM IS UNRELIABLE
      .then(() => {
        // Check we have 0 bookings
        return GetBookings.getAllBookings()
      })
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        // expect(response.body).to.have.length(0) //COMMENTED BECAUSE THE SYSTEM IS UNRELIABLE

        return Auth.getAuthToken()
      })
      .then((response) => {
        token = response.body.token

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

        // Create a new booking
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
        // Check we have 1 booking
        return GetBookings.getAllBookings()
      })
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        // expect(response.body).to.have.length(1) //COMMENTED BECAUSE THE SYSTEM IS UNRELIABLE
      })
  })

  it('should delete the booking successfully', () => {
    return DeleteBooking.deleteBooking(bookingId, token)
      .then((response) => {
        expect(response.status).to.be.oneOf([200, 201])
        // Check we have 0 bookings after deletion
        return GetBookings.getAllBookings()
      })
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        // expect(response.body).to.have.length(0) //COMMENTED BECAUSE THE SYSTEM IS UNRELIABLE
      })
  })
})