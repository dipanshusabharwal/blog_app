from flask import Blueprint, request, make_response, jsonify
from server import mysql
import os
import hashlib
import jwt

auth = Blueprint("auth", __name__)


def generate_salt():
    salt = os.urandom(16)
    salt = salt.encode('base-64')
    return salt


def rehash_salted_password(hashed_salted_password):
    hash = hashlib.md5()

    for i in range(30):
        hash.update(hashed_salted_password.encode("utf-8"))

    return hash


def generate_hashed_password(salted_password):
    hash = hashlib.md5()
    hash.update(salted_password.encode("utf-8"))

    rehashed_salted_password = rehash_salted_password(hash.hexdigest()).hexdigest()
    return rehashed_salted_password


def user_exists_check(email):
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT id FROM users WHERE email = %s""", (email,))

    results = cursor.fetchall()
    items = []
    for item in results:
        items.append(item)

    mysql.connection.commit()
    cursor.close()

    if len(items) > 0:
        return True
    else:
        return False


def fetch_user_details(email):
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT * FROM users WHERE email = %s""", (email,))

    results = cursor.fetchall()

    all_details = {}
    details = {}
    confidential_details = {}

    for user in results:
        details["id"] = user["id"]
        details["name"] = user["name"]
        details["email"] = user["email"]
        details["image_url"] = user["image_url"]

    cursor.execute("""SELECT * FROM passwords WHERE user_id = %s""", (details["id"],))
    result = cursor.fetchall()

    for password_details in result:
        confidential_details["salt"] = password_details["salt"]
        confidential_details["password"] = password_details["password"]

    mysql.connection.commit()
    cursor.close()

    all_details["details"] = details
    all_details["confidential_details"] = confidential_details

    return all_details


@auth.route("/signup", methods=["POST"])
def signup():
    name = request.json["name"].lower()
    email = request.json["email"].lower()
    password = request.json["password"]

    if user_exists_check(email):
        return {"status": 400, "message": "Signup Failed. User already exists"}
    else:
        salt = generate_salt()
        hashed_password = generate_hashed_password(salt + password)

        cursor = mysql.connection.cursor()

        cursor.execute("""INSERT INTO users (name, email) VALUES (%s, %s)""", (name, email))

        cursor.execute("""SELECT id FROM users WHERE email = %s""", (email,))
        results = cursor.fetchall()
        items = []
        for item in results:
            items.append(item)
        user_id = int(items[0]["id"])

        cursor.execute(
            """INSERT INTO passwords (user_id, salt, password) VALUES (%s, %s, %s)""", (user_id, salt, hashed_password))

        mysql.connection.commit()
        cursor.close()

        return {"status": 200, "message": "Signup successful"}


@auth.route("/login", methods=["POST"])
def login():
    email = request.json["email"].lower()
    password = request.json["password"]

    if user_exists_check(email):
        all_details = fetch_user_details(email)

        details = all_details["details"]
        confidential_details = all_details["confidential_details"]
        salt = confidential_details["salt"]
        hashed_password_from_database = confidential_details["password"]

        hashed_password = generate_hashed_password(salt + password)

        if hashed_password == hashed_password_from_database:
            token = jwt.encode({"id": details["id"]}, "masai02@", algorithm="HS256")
            return {"status": 200, "message": "Login Successful", "token": token}
        else:
            return {"status": 400, "message": "Login failed. Passwords do not match"}
    else:
        return {"status": 400, "message": "User does not exist"}


def fetch_user_id(auth_header):
    encoded_token = auth_header.split(" ")[1]
    decoded_data = jwt.decode(encoded_token, "masai02@", algorithm=["HS256"])
    return decoded_data["id"]


@auth.route("/fetch-user-details", methods=["GET"])
def fetch_user():
    current_user_id = fetch_user_id(request.headers.get("Authorization"))

    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT * FROM users WHERE id = %s""", (current_user_id,))
    results = cursor.fetchall()

    mysql.connection.commit()
    cursor.close()

    return {"status": 200, "message": "Blog fetch successful", "user": results}
