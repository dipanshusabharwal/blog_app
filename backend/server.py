from flask import Flask
from flask_mysqldb import MySQL

app = Flask(__name__)
mysql = MySQL(app)
app.config['MYSQL_USER'] = 'dipanshu'
app.config['MYSQL_PASSWORD'] = 'MasaiSchool02@'
app.config['MYSQL_DB'] = 'sql_blog'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

from auth import auth
from profile import profile
from blog import blog

app.register_blueprint(auth, url_prefix="/auth")
app.register_blueprint(profile, url_prefix="/profile")
app.register_blueprint(blog, url_prefix="/blog")


@app.after_request
def add_header(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization ')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE')

    return response
