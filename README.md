# Dependencies
### python modules:
		Flask 			pip install Flask
		Flask-SQLAlchemy 	pip install Flask-SQLAlchemy
		argon2-cffi 		pip install argon2-cffi
		flask-wtf 		pip install flask-wtf
## Notice: Be sure to have pip up to date! (pip install --upgrade pip)
### Others:
		SQLite3			https://www.sqlite.org/download.html


# TODO
- Restrict pages to logged-in users (Manage sessions)
- Enforce a password policy
- Save user preferences
- Password confirmation box in registration page
- Polish the salt generator to prevent collisions
- Update the backend to store assignments created by the user
- Update the Monthly and Weekly Calendar to pull assignments
- details from the backend and have it automatically formatted. 
- Assignment details such as 
	 - Assignment Title
	 - (Optional?) Description
	 - Due Date (Time, Date, Month, Year)
