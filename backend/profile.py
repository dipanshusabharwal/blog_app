from flask import Blueprint, request
from server import mysql
import os
import jwt

profile = Blueprint("profile", __name__)


def fetch_user_id(auth_header):
    encoded_token = auth_header.split(" ")[1]
    decoded_data = jwt.decode(encoded_token, "masai02@", algorithm=["HS256"])
    return decoded_data["id"]


def fetch_user_details(id):
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT * FROM users WHERE id = %s""", (id,))

    results = cursor.fetchall()

    details = {}

    for user in results:
        details["id"] = user["id"]
        details["name"] = user["name"]
        details["email"] = user["email"]
        details["image_url"] = user["image_url"]

    mysql.connection.commit()
    cursor.close()

    return details


def image_exists_check(location):
    if os.path.exists(location):
        return True
    else:
        return False


@profile.route("", methods=["get"])
def user_details():
    current_user_id = fetch_user_id(request.headers.get("Authorization"))
    current_user_details = fetch_user_details(current_user_id)
    return {"status": 200, "message": "Success", "details": current_user_details}


def upload_current_user_image(user_id, image_url):
    cursor = mysql.connection.cursor()

    cursor.execute("""UPDATE users SET image_url = %s WHERE id = %s""", (image_url, user_id))

    mysql.connection.commit()
    cursor.close()


@profile.route("upload-image", methods=["post"])
def upload_image():
    f = request.files["image"]
    location = "public/static/" + f.filename
    if not image_exists_check(location):
        f.save(location)

    current_user_id = fetch_user_id(request.headers.get("Authorization"))
    upload_current_user_image(current_user_id, "/static/" + f.filename)
    current_user_details = fetch_user_details(current_user_id)

    return {"status": 200, "message": "Image upload sucess", "details": current_user_details}
