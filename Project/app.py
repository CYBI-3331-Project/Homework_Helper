from flask import Flask, render_template, Response
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def log_in():
    return render_template('log_in.html')

@app.route('/Create_your_account/')
def create():
    return render_template('create_acct.html')

@app.route('/Forgot_Password/')
def forgotpw():
    return render_template('forgotpw.html')

@app.route('/Homepage/')
def homepage():
    return render_template('homepage.html')

@app.route('/Homepage/Study_Mode')
def study_mode():
    return render_template('study_mode.html')

@app.route('/Homepage/Assessments')
def assessments():
    return render_template('assignment_dash.html')

@app.route('/Homepage/Assessments/Create_Assessment')
def create_assessment():
    return render_template('create_assessment.html')

@app.route('/Homepage/Monthly_Calendar')
def monthly_calendar():
    return render_template('monthly_calendar.html')

if __name__ == "__main__":
    app.run(debug=True) #app.run(host='192.168.1.142') to make searchable through IP
