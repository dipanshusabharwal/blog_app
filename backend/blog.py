from flask import Blueprint, request
from server import mysql
import jwt
import datetime

blog = Blueprint("blog", __name__)


def fetch_user_id(auth_header):
    encoded_token = auth_header.split(" ")[1]
    decoded_data = jwt.decode(encoded_token, "masai02@", algorithm=["HS256"])
    return decoded_data["id"]


def fetch_category_id(category):
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT id FROM category WHERE name = %s""", (category,))

    results = cursor.fetchall()

    category_id = ""

    for item in results:
        category_id = item["id"]

    mysql.connection.commit()
    cursor.close()

    return category_id


@blog.route("/fetch/category", methods=["GET"])
def fetch_categories():
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT name FROM category""")

    results = cursor.fetchall()

    categories = []

    for category in results:
        categories.append(category["name"])

    mysql.connection.commit()
    cursor.close()

    return {"status": 200, "message": "Category fetch successful", "categories": categories}


@blog.route("/fetch/user-blogs", methods=["GET"])
def fetch_blogs():
    blogs = []
    current_user_id = fetch_user_id(request.headers.get("Authorization"))

    cursor = mysql.connection.cursor()

    cursor.execute("""SELECT * FROM blogs WHERE user_id = %s""", (current_user_id,))
    results = cursor.fetchall()

    for blog in results:
        cursor.execute("""SELECT name FROM category WHERE id = %s""", (blog["category_id"],))
        category_results = cursor.fetchall()
        for category in category_results:
            blog["category"] = category["name"]

        cursor.execute("""SELECT image_url FROM users WHERE id = %s""", (current_user_id,))
        user_results = cursor.fetchall()
        for user_details in user_results:
            blog["image_url"] = user_details["image_url"]
        blogs.append(blog)

    mysql.connection.commit()
    cursor.close()

    return {"status": 200, "message": "Blogs fetch successful", "blogs": blogs}


@blog.route("/fetch/all-blogs", methods=["GET"])
def fetch_all_blogs():
    blogs = []

    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT * FROM blogs""")
    results = cursor.fetchall()

    for blog in results:
        cursor.execute("""SELECT name FROM category WHERE id = %s""", (blog["category_id"],))
        category_results = cursor.fetchall()
        for category in category_results:
            blog["category"] = category["name"]

        cursor.execute("""SELECT name, image_url FROM users WHERE id = %s""", (blog["user_id"],))
        user_results = cursor.fetchall()
        for user_details in user_results:
            blog["name"] = user_details["name"]
            blog["image_url"] = user_details["image_url"]
        blogs.append(blog)

    mysql.connection.commit()
    cursor.close()

    return {"status": 200, "message": "All blogs fetch successful", "blogs": blogs}


@blog.route("/create", methods=["POST"])
def create_blog():
    category = request.json["blogCategory"]
    title = request.json["blogTitle"]
    content = request.json["blogContent"]

    current_user_id = fetch_user_id(request.headers.get("Authorization"))
    category_id = fetch_category_id(category)

    cursor = mysql.connection.cursor()

    cursor.execute(
        """INSERT INTO blogs (user_id, category_id, title, content, time_created) VALUES (%s, %s, %s, %s, %s)""",
        (current_user_id, category_id, title, content, datetime.datetime.now()))

    mysql.connection.commit()
    cursor.close()

    return {"status": 200, "message": "Blog creation successful"}


@blog.route("/delete", methods=["DELETE"])
def delete_blog():
    blog_id = request.json["blogId"]

    if request.headers.get("Authorization") is None:
        return {"status": 400, "message": "User Token missing"}
    else:
        current_user_id = fetch_user_id(request.headers.get("Authorization"))

        cursor = mysql.connection.cursor()

        cursor.execute(
            """DELETE FROM blogs WHERE id = %s AND user_id =%s""",
            (blog_id, current_user_id))

        mysql.connection.commit()
        cursor.close()

        return {"status": 200, "message": "Blog deleted successful"}


@blog.route("/fetch/single", methods=["POST"])
def fetch_a_blog():
    blog_id = request.json["blogId"]
    view_blog = []

    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT * FROM blogs WHERE id = %s""", (blog_id,))
    results = cursor.fetchall()

    for blog in results:
        cursor.execute("""SELECT name FROM category WHERE id = %s""", (blog["category_id"],))
        category_results = cursor.fetchall()
        for category in category_results:
            blog["category"] = category["name"]

        cursor.execute("""SELECT name, image_url FROM users WHERE id = %s""", (blog["user_id"],))
        user_results = cursor.fetchall()
        for user_details in user_results:
            blog["name"] = user_details["name"]
            blog["image_url"] = user_details["image_url"]
        view_blog.append(blog)

    mysql.connection.commit()
    cursor.close()

    return {"status": 200, "message": "Blog fetch successful", "blog": view_blog}


@blog.route("/edit", methods=["POST"])
def edit_blog():
    category = request.json["blogCategory"]
    title = request.json["blogTitle"]
    content = request.json["blogContent"]
    blog_id = request.json["blogId"]

    current_user_id = fetch_user_id(request.headers.get("Authorization"))
    category_id = fetch_category_id(category)

    cursor = mysql.connection.cursor()

    cursor.execute(
        """UPDATE blogs SET category_id = %s, title = %s, content = %s, time_created = %s WHERE user_id = %s AND id = %s""",
        (category_id, title, content, datetime.datetime.now(), current_user_id, blog_id))

    mysql.connection.commit()
    cursor.close()

    return {"status": 200, "message": "Blog edit successful"}


@blog.route("/create-comment", methods=["POST"])
def create_comment():
    comment = request.json["comment"]
    blog_id = request.json["blogId"]
    current_user_id = fetch_user_id(request.headers.get("Authorization"))

    cursor = mysql.connection.cursor()

    cursor.execute(
        """INSERT INTO comments (blog_id, user_id, comment_content, time_created) VALUES (%s, %s, %s, %s)""",
        (blog_id, current_user_id, comment, datetime.datetime.now()))

    mysql.connection.commit()
    cursor.close()

    return {"status": 200, "message": "Comment added"}


@blog.route("/fetch-comment", methods=["POST"])
def fetch_comment():
    blog_id = int(request.json["blogId"])

    cursor = mysql.connection.cursor()

    cursor.execute("""SELECT * FROM comments WHERE blog_id = %s""", (blog_id,))
    results = cursor.fetchall()

    comments = []

    for comment in results:
        user_id = comment["user_id"]
        cursor.execute("""SELECT * FROM users WHERE id = %s""", (user_id,))
        user_results = cursor.fetchall()
        for user in user_results:
            if user["id"] == user_id:
                comment["name"] = user["name"]
                comment["image_url"] = user["image_url"]
                comment["email"] = user["email"]
        comments.append(comment)

    mysql.connection.commit()
    cursor.close()

    return {"status": 200, "message": "Comment fetch successful", "comments": comments}


@blog.route("/delete-comment", methods=["POST"])
def delete_comment():
    comment_id = request.json["commentId"]
    current_user_id = fetch_user_id(request.headers.get("Authorization"))

    cursor = mysql.connection.cursor()

    cursor.execute(
        """DELETE FROM comments WHERE id=%s and user_id=%s""",
        (comment_id, current_user_id))

    mysql.connection.commit()
    cursor.close()

    return {"status": 200, "message": "Comment deletion successful"}


@blog.route("/edit-comment", methods=["POST"])
def edit_comment():
    comment_id = request.json["commentId"]
    comment_content = request.json["comment"]
    current_user_id = fetch_user_id(request.headers.get("Authorization"))

    cursor = mysql.connection.cursor()

    cursor.execute(
        """UPDATE comments SET comment_content = %s, time_created=%s WHERE id = %s AND user_id = %s""",
        (comment_content, datetime.datetime.now(), comment_id, current_user_id))

    mysql.connection.commit()
    cursor.close()

    return {"status": 200, "message": "Comment edit successful"}
