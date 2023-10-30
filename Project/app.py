from flask import Flask, render_template, Response, flash, redirect, url_for
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy #pip install Flask-SQLAlchemy
from pathlib import Path
from argon2 import PasswordHasher       #pip install argon2-cffi
from flask_wtf import FlaskForm         #pip install flask-wtf
from wtforms import StringField, IntegerField, SubmitField, EmailField, TelField
from wtforms.validators import data_required
import os, time


app = Flask(__name__)

#Secret key to prevent CSRF
app.config['SECRET_KEY'] = 'insecurePassword'

#Configuring the Database location
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{Path(__file__).parent / 'Databases/userAccounts.db'}"

#Initialize the database
db = SQLAlchemy(app)

#================Functions

#Salt generator for password hashes
def generateSalt():
    return os.urandom(16)

#Password hash generator
def generateHash(passw, salt):

    passHasher = PasswordHasher()
    pass_hash = passHasher.hash(passw, salt=salt)
    if(passHasher.verify(pass_hash, passw)):
        print('Password successfully verified')
        return pass_hash
    else:
        print('Password verification error')
        return -1
    

#==================Classes

#Creating a model for user credentials
class  UserCredentials(db.Model):
    user_ID = db.Column(db.Integer, primary_key=True)
    user_Name = db.Column(db.String(50),nullable=False)
    user_Email = db.Column(db.String(60), nullable=False, unique=True)
    user_Phone = db.Column(db.Integer, unique=True)
    pass_salt = db.Column(db.Integer, nullable=False, unique=True)
    pass_hash = db.Column(db.String, nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)


    #Creating a string
    def __repr__(self):
        return '<Name %r>' % self.user_Name

#Create a form class
class RegisterForm (FlaskForm):
    username = StringField("Name: ", validators=[data_required()])
    email = EmailField("Email: ", validators=[data_required()])
    phone = TelField("Phone: ")
    password = StringField("Password: ", validators=[data_required()])
    submit = SubmitField("Register")



#Creates a context to manage the database
with app.app_context():
    #Adds all of the models as tables to the database
    #db.create_all()

    #Drops all tables from the database
    #db.drop_all()

    #LoginCredentials.__table__.create(db.engine)

    #Drops one specific table
    #LoginCredentials.__table__.drop(db.engine)
    pass


# Route for the default landing page
@app.route('/', methods=['POST', 'GET'])
def log_in():
    return render_template('log_in.html')

@app.route('/create_account',  methods=['POST', 'GET'])
def Register():
    username = None
    email = None
    phone = None
    password = None
    passHash = None
    salt = generateSalt()
    form = RegisterForm()

    #Validation
    if form.validate_on_submit():
        user = UserCredentials.query.filter_by(user_Email=form.email.data).first()
        if user is None:
            user = UserCredentials.query.filter_by(user_Phone=form.phone.data).first()
            if user is None:
                passHash = generateHash(form.password.data, salt)
                user = UserCredentials(user_Name = form.username.data, user_Email = form.email.data, user_Phone = form.phone.data, pass_salt = salt, pass_hash = passHash)
                db.session.add(user)
                db.session.commit()
        username = form.username.data
        form.username.data = ''
        email = form.email.data
        form.email.data = ''
        phone = form.phone.data
        form.phone.data = ''
        password = form.password.data
        form.password.data = ''
        flash("Account created")
        return redirect(url_for('homepage'))

    return render_template('create_acct.html', form=form, username = username, email = email, phone = phone, salt = salt, passHash = passHash)

       

@app.route('/Forgot_Password')
def forgotpw():
    return render_template('forgotpw.html')

@app.route('/Homepage')
def homepage():
    return render_template('homepage.html')

@app.route('/Homepage/Study_Mode')
def study_mode():
    return render_template('study_mode.html')

@app.route('/Homepage/Assignment_dash')
def assignment_dash():
    return render_template('assignment_dash.html')

@app.route('/Homepage/Assignment_dash/Create_Assessment')
def create_assessment():
    return render_template('create_assessment.html')

@app.route('/Homepage/Weekly_View')
def weekly_calendar():
    return render_template('weekly_calendar.html')

@app.route('/Homepage/Settings')
def settings():
    return render_template('settings.html')

if __name__ == "__main__":
    app.run(debug=True) #app.run(host='192.168.1.142') to make searchable through IP
                        #I don't believe this option works if we are not on the same network


