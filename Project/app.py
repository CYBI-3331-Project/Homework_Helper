import string
from flask import Flask, render_template, Response, flash, redirect, url_for, session
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy #pip install Flask-SQLAlchemy
from pathlib import Path
from argon2 import PasswordHasher       #pip install argon2-cffi
from flask_wtf import FlaskForm         #pip install flask-wtf
from wtforms import StringField, IntegerField, SubmitField, EmailField, TelField, DateField, TextAreaField, RadioField
from wtforms.validators import data_required
from flask import jsonify
import os, time

app = Flask(__name__)

#Secret key to prevent CSRF, cryptographically signs session cookies
app.config['SECRET_KEY'] = 'insecurePassword'

#Configuring the Database location
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{Path(__file__).parent / 'Databases/userAccounts.db'}"

#Initialize the database
db = SQLAlchemy(app)



#====================================================== Functions

# Salt generator for password hashes
def generateSalt():
    return os.urandom(16)

# Password hash generator
def generateHash(passw, salt):

    passHasher = PasswordHasher()
    pass_hash = passHasher.hash(passw, salt=salt)
    
    #Verifies that the password matches with the hash
    if(passHasher.verify(pass_hash, passw)):
        print('Password successfully verified')
        return pass_hash
    else:
        print('Password verification error')
        return -1

# Finction to strip multiple characters from a string
def stripChars(input: string, strip: string):
    begStr = str(input)
    chars = str(strip)

    for ch in chars:
        if ch in begStr:
            begStr = begStr.replace(ch, '')
            
    return begStr

    



#============================================== Classes
#======================================================== Databases

#Creating a model for user credentials
class  UserCredentials(db.Model):
    user_ID = db.Column(db.Integer, primary_key=True)
    user_Name = db.Column(db.String(50),nullable=False)
    user_Email = db.Column(db.String(60), nullable=False, unique=True)
    user_Phone = db.Column(db.Integer, unique=True)
    pass_salt = db.Column(db.Integer, nullable=False, unique=True)
    pass_hash = db.Column(db.String, nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)
    
    assignments = db.relationship('Assignments', backref='userCred', lazy=True)


    #Creating a string
    def __repr__(self):
        return '<Name %r>' % self.user_Name
    

#     #Creating a string    
#     def __repr__(self):
#         return '<Name %r>' % self.user_Name

#Creating a model for user assignments
class  Assignments(db.Model):
    ID = db.Column(db.Integer,primary_key=True)
    user_ID = db.Column(db.Integer, db.ForeignKey('user_credentials.user_ID'))  
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(300), nullable=True)
    date_Created = db.Column(db.DateTime, default=datetime.utcnow)
    date_Due = db.Column(db.DateTime, nullable=False)
    priority = db.Column(db.Integer, nullable=False)


#======================================================== Forms

#Create a registration form class
class RegisterForm (FlaskForm):
    username = StringField("Name: ", validators=[data_required()])
    email = EmailField("Email: ", validators=[data_required()])
    phone = TelField("Phone: ")
    password = StringField("Password: ", validators=[data_required()])
    submit = SubmitField("Register")

#Create a login form class
class LoginForm (FlaskForm):
    username = StringField("Name: ", validators=[data_required()])
    password = StringField("Password: ", validators=[data_required()])
    submit = SubmitField("Log in")

#Create a AssessmentForm form class
class AssessmentForm (FlaskForm):
    title = StringField("Assessment Title", validators=[data_required()])
    description = TextAreaField("Description (optional)")
    date = DateField("Due date", validators=[data_required()])
    priority = RadioField("Priority",  choices=['N/A', 'Low', 'Medium', 'High'], validators=[data_required()])
    submit = SubmitField("Submit")



#====================================================== App Context

#Creates a context to manage the database
with app.app_context():
    #Drops all tables from the database
    # db.drop_all()

    #Adds tables out of all the modles in the database, unless they already exist
    #  db.create_all()

    #LoginCredentials.__table__.create(db.engine)

    #Drops one specific table
    #LoginCredentials.__table__.drop(db.engine)
    pass




#============================================== App routes
#====================================================== Default/Login
#Handles the backend of the login page
@app.route('/', methods=['POST', 'GET'])
def log_in():
    # Initializes values to None 
    username = None
    password = None
    passHash = None
    salt = None

    # Specifies the form class to use
    form = LoginForm()

    #Checks if the submit button has been pressed
    if form.validate_on_submit():
        # Queries the database to see if the username exists
        user = UserCredentials.query.filter_by(user_Name=form.username.data).first()
        # if user exists
        if user is not None:
            # The salt and hash associated with the user's profile are taken from the database
            salt = user.pass_salt
            userHash = user.pass_hash
            # A new hash is generated with the password entered into the login form, using the same salt that is within the database
            passHash = generateHash(form.password.data, salt)
            # The newly generated hash is compared to the hash within the database
            if passHash == userHash:
                session['username'] = user.user_Name
                session['user_id'] = user.user_ID
                # If the hashes matched, the user is logged in and redirected to the home page
                return redirect(url_for('homepage'))
            #Otherwise, the user is not redirected and the form is cleared
            else:
                #SQL injection easter egg
                if form.password.data.lower() == "'or 1 = 1":
                    flash("Nice try.")
                else:
                    flash("Error: the information you entered does not match our records.")
        else:
            if form.password.data.lower() == "'or 1 = 1":
                    flash("Nice try.")
            else:
                flash("Error: the information you entered does not match our records.")

        #Clearing the form data after it has been submitted
        username = form.username.data
        form.username.data = ''
        password = form.password.data
        form.password.data = ''
    # Re-rendering the login page after a failed login attempt
    return render_template('log_in.html', form=form, username = username, salt = salt, passHash = passHash)


#====================================================== Account creation
@app.route('/create_account',  methods=['POST', 'GET'])
def Register():
    username = None
    email = None
    phone = None
    password = None
    passHash = None
    salt = generateSalt()
    form = RegisterForm()

    # Checks if the submit button has been pressed
    if form.validate_on_submit():
        # Queries the database to see if the email already exists in the database
        user = UserCredentials.query.filter_by(user_Email=form.email.data).first()
        if user is None:
            # If no user exists with the email entered, checks to see if the phone number exists in the database
            user = UserCredentials.query.filter_by(user_Phone=form.phone.data).first()
            if user is None:
                # If no user exists with the phone nunmber entered, A hash is generated from the user's password with a random salt
                passHash = generateHash(form.password.data, salt)
                # A database object is created with the user's information
                user = UserCredentials(user_Name = form.username.data, user_Email = form.email.data, user_Phone = form.phone.data, pass_salt = salt, pass_hash = passHash)
                session['username'] = user.user_Name
                
                # The newly created user object is added to a database session, and committed as an entry to the user_credentials table
                db.session.add(user)
                db.session.commit()
                session['user_id'] = (UserCredentials.query.filter_by(user_Name = form.username.data).first()).user_ID
                # The user is logged in and redirected to the homepage
                return redirect(url_for('homepage'))
            
            # If the phone number that was entered is associated with an existing user account, the user is instead brought back to the registration page
            else:
                flash("Error: Phone number already in use.")
        # If the email that was entered is associated with an existing user account, the user is instead brought back to the registration page
        else:
            flash("Error: Email already in use.")

        #Clearing the form data after it has been submitted
        username = form.username.data
        form.username.data = ''
        email = form.email.data
        form.email.data = ''
        phone = form.phone.data
        form.phone.data = ''
        password = form.password.data
        form.password.data = ''

     # Re-rendering the account creation page after an unsuccessful submission
    
    return render_template('create_acct.html', form=form, username = username, email = email, phone = phone, salt = salt, passHash = passHash)

       

#====================================================== Forgot Password
@app.route('/Forgot_Password')
def forgotpw():
    return render_template('forgotpw.html')

#====================================================== Homepage
@app.route('/Homepage')
def homepage():
    if session.get('username'):
        greeting = "Hello, " + session['username'] + '.'
        flash(greeting)
        return render_template('homepage.html')
    else:
        return redirect(url_for('log_in'))



#====================================================== Study Mode
@app.route('/Homepage/Study_Mode')
def study_mode():
    return render_template('study_mode.html')

#====================================================== Assignment Dashboard
@app.route('/Homepage/Assignment_dash')
def assignment_dash():
    if session.get('username'):
        return render_template('assignment_dash.html')
    else:
        return redirect(url_for('log_in'))
    

#====================================================== Create assessment #===============================================#===============================================
@app.route('/Homepage/Assignment_dash/Create_Assessment',  methods=['POST', 'GET'])
def create_assessment():
    if session.get('username'):
        # Initializes values to None 
        title = None
        description = None
        date = None
        submit = None
        priority = None
        maxChars = 500

        # Specifies the form class to use
        form = AssessmentForm()

        #Checks if the submit button has been pressed
        if form.validate_on_submit():
            if(len(form.description.data) > maxChars):
                errorMsg = "Error: Max description length is", maxChars, "characters. Character count: ", len(form.description.data)
                flash(stripChars(str(errorMsg), "',()"))
            else:
                assignment = Assignments(user_ID=session['user_id'], title=form.title.data, description=form.description.data, date_Due=form.date.data, priority=form.priority.data)
                db.session.add(assignment)
                db.session.commit()
                flash("Assignment added to DB")

            

            #Clearing the form data after it has been submitted
        title = form.title.data
        form.title.data = ''
        description = form.description.data
        form.description.data = ''
        date = form.date.data
        form.date.data = ''
        submit = form.submit.data
        form.submit.data = ''
        priority = form.priority.data
        form.priority.data = ''
        # Re-rendering the login page after a failed login attempt
        return render_template('create_assessment.html', title=title, description=description, date=date, submit=submit, priority=priority, form=form)
    else:
        return redirect(url_for('log_in'))


#====================================================== Get Events
@app.route('/Homepage/get_events',  methods=['GET'])
def get_events_route():
    # Replace this with your actual code to fetch events from the database
    userAssignments = Assignments.query.filter_by(user_ID= session['user_id']).all()
    events = []
    print("userAssignments: ", userAssignments)
    for assignment in userAssignments:
        date =str(assignment.date_Due).split('-')
        day = date[2][:2]
        month = date[1]
        year = date[0]
        print(assignment.title)
        print('Day: ', day, 'Month: ', month, 'Year: ', year)

        events.append([day, month, year, assignment.title, assignment.description, assignment.priority])
    print(events)
    # "title": assignment.title,
    # "description": assignment.description,
    return jsonify(events)

#====================================================== Calendar
@app.route('/Homepage/Weekly_View')
def weekly_calendar():
    if session.get('username'):
        return render_template('weekly_calendar.html')
    else:
        return redirect(url_for('log_in'))

#====================================================== Settings
@app.route('/Homepage/Settings')
def settings():
    if session.get('username'):
        return render_template('settings.html')
    else:
        return redirect(url_for('log_in'))

    

#====================================================== Log out
@app.route('/logout')
def log_out():
    if session.get('username'):
        session.pop('username')
    return redirect(url_for('log_in'))




#====================================================== Main
if __name__ == "__main__":
    app.run(debug=True) #app.run(host='192.168.1.142') to make searchable through IP    
                        #I don't believe this option works if we are not on the same network
