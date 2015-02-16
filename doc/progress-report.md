### Midterm Progress Report
_February 15, 2015_  
Project by Connor Bode (&#35;6281060); supervised by Stuart Thiel.

##### Project Background
The project is a data structures teaching tool.  The resulting application will allow users to step through the manipulation of a data structure action by action.  The application will consist of many data structures, each of which will have a set of operations that can be performed upon it.  A saved set of operations on a data structure is known as a __sequence__.  A user can step through the operations in a sequence in a similar fashion to stepping through keyframes in an animation.

##### Achievements
- Elicited project requirements.
- Formalized project requirements in a software requirements specification.
- Completed the server component of the project including: 
  - account registration using OAuth 2.0 with Github as a single sign-on service provider
  - account log in / log out (also using OAuth 2.0 with Github)
  - CRUD operations on sequences
- 85.23% branch coverage.  The uncovered branches are all related to elevating failed database requests.

##### Problems
- The database chosen does not support transactions so there is a major potential for database corruption.  Solving this problem will require a re-write of the data-source layer of the application.  If time allows, this problem will be solved.
- I have not yet found a way to simulate a failed database request for testing.  This is crucial to achieve 100% branch coverage.

##### Next Steps
- Develop a web interface for the application
- Attempt full test coverage for the interface
- Write system tests & provide traceability to initial requirements

##### Assessment of Schedule
- Project is on schedule
- Schedule will likely not allow for data-source rewrite