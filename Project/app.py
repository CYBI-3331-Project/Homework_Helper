import string
from flask import Flask, render_template, Response, flash, redirect, url_for, session
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy #pip install Flask-SQLAlchemy
from pathlib import Path
from argon2 import PasswordHasher       #pip install argon2-cffi
from flask_wtf import FlaskForm         #pip install flask-wtf
from wtforms import StringField, IntegerField, SubmitField, EmailField, TelField, DateField, TextAreaField, RadioField, BooleanField 
from wtforms.validators import data_required, ValidationError
from flask import jsonify
from password_strength import PasswordPolicy, PasswordStats
import os, time

app = Flask(__name__)

#Secret key to prevent CSRF, cryptographically signs session cookies
app.config['SECRET_KEY'] = 'insecurePassword'

#Configuring the Database location
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{Path(__file__).parent / 'Databases/userAccounts.db'}"

#Initialize the database
db = SQLAlchemy(app)

# Setting default password policy
passLen = 9
passCase = 1
passNum = 1
passSpec = 1



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

# Custom WTForms validator to check password complexity 
def validatePassword(form, field):
    uppers = sum(1 for c in field.data if c.isupper())
    digits = sum(1 for c in field.data if c.isdigit())
    specials = 0
    for c in field.data:
        if ord(c) >= 32 and ord(c) <= 47:
            specials += 1
        elif ord(c) >= 58 and ord(c) <= 64:
            specials += 1
        elif ord(c) >= 91 and ord(c) <= 96:
            specials += 1
        elif ord(c) >= 123 and ord(c) <= 126:
            specials += 1
    if len(field.data) < passLen:
        print('len error')
        raise ValidationError('Password must contian at least ' + str(passLen) + ' characters')
    elif uppers < passCase:
        print('case error')
        raise ValidationError('Password must contain at least ' + str(passCase) + ' upper-case character')
    elif digits < passNum:
        print('num error')
        raise ValidationError('Password must contain at least ' + str(passNum) + ' number')
    elif specials < passSpec:
        print('spec error')
        raise ValidationError('Password must contain at least ' + str(passSpec) + ' special character')
    




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
    username = StringField("Username: ", validators=[data_required()])
    email = EmailField("Email: ", validators=[data_required()])
    phone = TelField("Phone: ")
    password = StringField("Password: ", validators=[data_required(), validatePassword])
    submit = SubmitField("Register")
    
#Create a login form class
class LoginForm (FlaskForm):
    username = StringField("Username: ", validators=[data_required()])
    password = StringField("Password: ", validators=[data_required()])
    submit = SubmitField("Log in")

#Create a AssessmentForm form class
class AssessmentForm (FlaskForm):
    title = StringField("Assessment Title", validators=[data_required()])
    description = TextAreaField("Description (optional)")
    date = DateField("Due date", validators=[data_required()])
    priority = RadioField("Priority",  choices=['N/A', 'Low', 'Medium', 'High'], validators=[data_required()])
    submit = SubmitField("Submit")

class SettingForm(FlaskForm):
    new_phone = TelField("New phone: ")
    new_username = StringField("New username:", validators=[data_required()])
    new_email = EmailField("New email: ", validators=[data_required()])
    submit = SubmitField("Apply Changes")

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
    if session.get('username'):
        return render_template('study_mode.html')
    else:
        return redirect(url_for('log_in'))
    

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
    userAssignments = Assignments.query.filter_by(user_ID= session['user_id']).all()
    events = []
    for assignment in userAssignments:
        date =str(assignment.date_Due).split('-')
        day = date[2][:2]
        month = date[1]
        year = date[0]

        events.append([day, month, year, assignment.title, assignment.description, assignment.priority])
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
# ... (other routes)

@app.route('/Homepage/Settings', methods=['POST', 'GET'])
def settings():
    # Initializes values to None 
    new_username = None
    new_email = None
    new_phone = None
    new_password = None
    user_ID = None
    id = None
    

    # Specifies the form class to use
    if session.get('username'):
        # Query the user's information from the database
        user = UserCredentials.query.filter_by(user_Name=session['username']).first()
        # Check if the user is found in the database
        id = user.user_ID
        name_to_update = UserCredentials.query.get_or_404(id)
        form = SettingForm()
        if form.validate_on_submit(): 
            # Check if the new username is empty or equals the current username
            if not form.new_username.data:
                flash("Error: New username cannot be empty")
            # Check if the new username is already taken
            elif form.new_username.data != user.user_Name and UserCredentials.query.filter_by(user_Name=form.new_username.data).first():
                flash("Error: New username is already taken.")
            # Check if the new email is empty or equals the current email
            elif not form.new_email.data:
                flash("Error: New email cannot be empty")
            # Check if the new email is already taken
            elif form.new_email.data != user.user_Email and UserCredentials.query.filter_by(user_Email=form.new_email.data).first():
                flash("Error: New email is already taken.")
            # Check if the new phone number is empty or equals the current phone number
            elif form.new_phone.data and (not form.new_phone.data.isdigit()):
                flash("Error: New phone number cannot be empty and must contain non-numeric characters.")
            # Check if the new phone number is already taken
            elif form.new_phone.data != user.user_Phone and UserCredentials.query.filter_by(user_Phone=form.new_phone.data).first():
                flash("Error: New phone number is already taken.")
            else:
                # Update user information
                name_to_update.user_Name = form.new_username.data
                name_to_update.user_Email = form.new_email.data
                name_to_update.user_Phone = form.new_phone.data
            try: 
                db.session.commit()
                flash("User Updated Successfully!")
                # Re-query the user after committing changes
                name_to_update = UserCredentials.query.get_or_404(id)
                print(f"Session username: {session.get('username')}")
                print(f"User ID: {id}")

                return render_template("settings.html", 
                        form=form, 
                        name_to_update = name_to_update, id=id)
            except: 
                flash("Error!")
                return render_template("settings.html", 
                        form=form,
                        name_to_update = name_to_update, id=id)
        else: 
            flash("Update User...")
            name_to_update = UserCredentials.query.get_or_404(id)
            print('form.errors: ', form.errors)
            #Clearing the form data after it has been submitted
            return render_template("settings.html", 
                            form=form,
                            name_to_update = name_to_update, 
                            id = id)
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
