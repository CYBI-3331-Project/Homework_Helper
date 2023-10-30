from flask import Flask, render_template, Response
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from pathlib import Path

app = Flask(__name__)

#Configuring the Database location
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{Path(__file__).parent / 'Databases/userAccounts.db'}"
db = SQLAlchemy(app)

#Creating a table class
class  LoginCredentials(db.Model):
    user_ID = db.Column(db.Integer, primary_key=True)
    user_Name = db.Column()
    pass_hash = db.Column()



#Creates a context to manage the database
with app.app_context():
    #Creates all tables from the table classes
    #db.create_all()

    #Drops all tables
    #db.drop_all()

    #LoginCredentials.__table__.create(db.engine)

    #Drops one specific table
    #LoginCredentials.__table__.drop(db.engine)
    pass

@app.route('/')
def log_in():
    return render_template('log_in.html')

@app.route('/Create_your_account')
def create():
    return render_template('create_acct.html')

@app.route('/Forgot_Password')
def forgotpw():
    return render_template('forgotpw.html')

@app.route('/Homepage/')
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