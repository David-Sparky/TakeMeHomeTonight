#TakeMeHomeTonight
Project for RPI ITWS-4500 Web Science Systems Development

#Goal
To provide a way for students to find rides to and from school easily, even if they don’t have a car or know someone who has one.

#Our Audience
Our audience is students, faculty and staff within the RPI community. The website can be used by those that have cars on campus and those who do not. Eventually, Take Me Home Tonight would like to branch out to other campuses. 

#Front End Technologies
HTML5, CSS3, JavaScript,  AngularJS, and Bootstrap

#Back End Technologies
Node.JS, NPM, MonogoDB, and Express

#Integrated Services
CAS for authentication, Google Maps, Amtrak API, Grehound API, CDTA Information and Taxi Information

#Future Plans
In the future we hope that Take Me Home Tonight will be adopted by other campuses across the US and possibly the world. While this would require some reconfiguring of the APIs and public transit information, but we are confident that the developers at the other schools will be able to implement these changes with a little bit of help from our team and the documentation that we will be providing.

Since our site is also currently in the prototype phase we currently do not have any live databases to supply data to the frontend. These databases will be implemented using MongoDB, and should be completed within the next week or so. There will likely be several tables, all linking back to one main user table. The other tables will hold data for the rides being offered and requested. In addition, our user table will allow users to add profile and account information. Since CAS only provides us with the user’s RCS ID and authentication, we will need to implement our own settings for the page. This will allow users to post things like a profile image, what car they are driving, and other relevant information.

In addition to databases, we will be implementing several layers of access control to enable users to have different privileges based on their role. For example, if a user offers a ride, they will have the ability to accept or reject people requesting access, but those granted access will not be able to do the same. We also plan to have an administrative role so we can designate moderators that will be able to monitor fake requests and prevent abuse of the service, taking actions only if they truly become necessary.

We must also still implement the public transit APIs mentioned above. These APIs will enable our users to find their way to destinations beyond TMHT’s reach. If a student, for example wants to spend the weekend in New York City with some friends, they can use our service to determine when each train is leaving Albany and how much the ticket will cost. Once they have this information, they can quickly search through the rides being offered and see if one of them meets their needs. If none of them do, they can request a ride and list multiple departure times that work for them. If they still can’t find a ride, our page will provide them with numbers to local taxi companies that they will be able to call.


#Project Timeline

Week of 3/28 
- Connect DB to website
- Connect ride form to DB and website
- Public Transit static page
- Taxi Information

Week of 4/4
- Settings Page / User Sign Up
- Access Control

Week of 4/11
- Amtrak API
- Static ride page

Week of 4/18
- Greyhound API
- CDTA Information

Week of 4/25
- Fix any bugs
- Finish extensive site testing
- Create final presentation

Week of 5/2
- Practice final presentation
- Present final presentation
