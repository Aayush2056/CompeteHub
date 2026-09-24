# CompeteHub
CompeteHub is a MERN-based competition management platform that enables users to discover competitions, submit projects, and manage competition workflows through dedicated user and organizer features.
## Important Assumptions

* The platform has two roles: **User** and **Admin**.
* Admins create and manage competitions, while users can browse, register, and submit their work.
* A user can register only once for a competition.
* A user can submit one submission per competition.
* Registration is available only between the configured start date and deadline.
* Competition status is calculated from the configured dates.
* Payment processing is not included in the current scope.
* Admin accounts are managed separately from normal user registration.

## Major Technical Decisions

* **MERN Stack:** Used React, Node.js, Express, and MongoDB to keep the application simple and consistent with a JavaScript-based full-stack architecture.
* **JWT Authentication:** Used JWT for authentication and role-based access to protected routes.
* **MongoDB Transactions:** Registration uses atomic updates and transactions to prevent the participant limit from being exceeded during concurrent registrations.
* **Dynamic Registration Fields:** Competitions can define their own registration fields, so the same registration system can support different types of competitions.
* **Reusable Components:** Common UI elements such as competition cards and protected routes are implemented as reusable components.
* **Cloudinary:** Used for storing uploaded images and submission files instead of keeping files directly on the application server.

## Trade-offs

* MongoDB provides flexibility for dynamic competition and registration data, but a relational database could be considered if the platform later requires more complex reporting and relationships.
* Context API is sufficient for the current application. A larger application with more shared state could use Redux Toolkit.
* Competition status is calculated from dates, which keeps the data up to date without manual status changes, but scheduled jobs could be used in a larger production system.
* The current system supports one judge per competition to keep the model simple. Multiple judges and scoring workflows can be added later.

## If This Were Developed for Production

Some improvements I would consider for a production version are:

* Add stronger request validation and rate limiting.
* Add email verification, password reset, and better authentication security.
* Add payment integration for competitions with entry fees.
* Add email notifications for registration, submission, and competition reminders.
* Add pagination, search, and filtering for competitions.
* Add automated unit, integration, and end-to-end tests.
* Add logging and error monitoring.
* Add CI/CD for automated testing and deployment.
* Introduce caching/background jobs if traffic grows.
* Support multiple judges, team registrations, scoring, and leaderboards as the product requirements expand.
