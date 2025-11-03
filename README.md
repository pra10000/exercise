# ReadMe

1.How to install and run it

a.Clone the repository, use the terminal, navigate to the folder you want to use and then use git clone with the link from this repository.

b.How to install dependecies. Use "npm install" inside the folder with the package.json file(Solved in cypress).

c.You can run both the UI and API by using the "npx cypress open" inside the folder with the package.json file(Solved in cypress).

2.What has been covered

a.The main flow of booking rooms(the flow that is working-setting dates for checking the availability and then clicking book room to use those dates, we can't change dates in the reserve room page so we can't test that flow at the moment)

b.The main errors of the reserver form

c.The main errors of the contact form

3.To do 
a. Add dedicated selectos for tests

b. Depending on the development of the application make the selectors more specific.(We need to maintain a balance between resilience and correctnes of tests
example-If we check for an element on all the screen, this is resilient because it doesn't depend on any extra selectors, on the other hand it may not be correct when new developments are made because it moved on the screen in the wrong section or we have an extra element with the same selector. This directions need to be discussed in the team depending on the development of the project. Now it focuses on resilience more.)

c.Speak to the developers to fix platform defects.(1.Rooms are present in the check availability filter even if they are booked, 2.Changing dates doesn't work in the reservation page 3. The filter dates can be set in the past, also the checkout date can be set before the check in 4. If we set the same day we have 0 days charged, check if this is the deesired behavior 5. Fix ambigous error "size must be between 11 and 21" and other ambigous errors.)

d.Create mechanism to have multiple enviroments.

e.Ask why you can't delete all the reservations using the APIs provided.

f.Ask how many rooms we have of each type.
