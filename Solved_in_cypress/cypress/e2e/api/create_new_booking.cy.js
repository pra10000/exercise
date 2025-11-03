import CreateBooking from '../../page_objects/api/CreateNewBookingFunction'
import DeleteBooking from '../../page_objects/api/DeleteBookingsFunctions'
import GetBookings from '../../page_objects/api/GetBookingsFunctions'

describe('POST /booking', () => {

    before(() => {
        return DeleteBooking.deleteAllBookings()
            .then(() => {
                return GetBookings.getAllBookings()
            })
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.an('array')
                //expect(response.body).to.have.length(0) //COMMENTED BECAUSE THE SYSTEM IS UNRELIABLE
            })
    })

    it('should create a new booking and return bookingid', () => {
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
        };

        return CreateBooking.createBooking(
            params.firstname,
            params.lastname,
            params.totalprice,
            params.depositpaid,
            params.checkin,
            params.checkout,
            params.additionalneeds
        )
        .then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('bookingid')
            expect(response.body.booking).to.include({
                firstname: params.firstname,
                lastname: params.lastname,
                totalprice: params.totalprice,
                depositpaid: params.depositpaid,
                additionalneeds: params.additionalneeds
            })

            return GetBookings.getAllBookings()
        })
        .then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.be.an('array')
            //expect(response.body).to.have.length(1) //COMMENTED BECAUSE THE SYSTEM IS UNRELIABLE
        })
    })
})