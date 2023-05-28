from flask import Flask, jsonify, request, send_file
from flask_mysqldb import MySQL
from datetime import datetime
import string
import os

app = Flask(__name__)
mysql = MySQL()
#MySQL configurations
app.config['MYSQL_HOST'] = '127.0.0.1'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'quizzeria'
#Initialize connection
mysql.init_app(app)

USER_IMAGE_FOLDER = os.path.join(os.getcwd(), 'frontend', 'src', 'images')
USER_FILE_FOLDER = os.path.join(os.getcwd(), 'frontend', 'src', 'files')

def get_db():
    return mysql.connection

#Function for when making changes to database
def run_query(query, args=None):

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(query, args)
    result = cursor.fetchall()
    conn.commit()
    cursor.close()

    return result

def convert_keys(dataList, keys):
    #Replace key values
    data = []
    for row in dataList:
        dict_row = {}
        for i, key in enumerate(keys):
            dict_row[key] = row[i]
        data.append(dict_row)
    return data

#Check if file name contains illegal characters
def sanitize_filename(filename):
    valid_chars = "-_.() %s%s" % (string.ascii_letters, string.digits)
    cleaned_filename = ''.join(c for c in filename if c in valid_chars)
    return cleaned_filename

@app.route("/api")
def home():
    adminData = {'name': 'John', 'age': 30, 'city': 'New York'}

    # Return the data as a JSON response
    return jsonify(adminData)

@app.route("/api/login/<string:username>/<string:password>", methods=['GET'])
def login(username, password):
    query = """
        SELECT
            COALESCE(student.student_id, teacher.teacher_id, admin.admin_id) AS id, 
            COALESCE(student.student_name, teacher.teacher_name, admin.admin_name) AS name, 
            COALESCE(student.student_age, teacher.teacher_age, admin.admin_age) AS age,
            COALESCE(student.student_email, teacher.teacher_email, admin.admin_email) AS email,
            COALESCE(student.student_admission, teacher.teacher_workplace, admin.admin_workplace) AS workplace,
            COALESCE(student.student_phone, teacher.teacher_phone, admin.admin_phone) AS phone,
            user.user_type,
            user.user_profile,
            user.user_status
        FROM user
            LEFT JOIN student ON user.student_id = student.student_id
            LEFT JOIN teacher ON user.teacher_id = teacher.teacher_id
            LEFT JOIN admin ON user.admin_id = admin.admin_id
        WHERE user.username = %s AND user.user_password = %s;
    """
    values = (username, password)
    user_keys = ['id', 'name', 'age', 'email', 'workplace', 'phone', 'type', 'profile', 'status']
    data = run_query(query, values)

    user_data = convert_keys(data, user_keys)

    if len(user_data) > 0: #If results are found
        return jsonify({'authentication': True, 'userData': user_data})
    else:
        return jsonify({'authentication': False})

@app.route("/api/register", methods=['POST'])
def register():
    conn = get_db()
    cursor = conn.cursor()
    user_info = request.json['data']

    username = user_info['username']
    password = user_info['password']
    email = user_info['email']
    type = user_info['type']

    query = f"""
        INSERT INTO `{type.lower()}` ( `{type.lower()}_name`, `{type.lower()}_email`)
        VALUES (%s, %s)
    """
    values = (username, email)
    cursor.execute(query, values)
    conn.commit()
    #Get latest auto-increment value of student
    id = str(cursor.lastrowid)

    query = f"""
        INSERT INTO `user` (`{type.lower()}_id`, `username`, `user_password`, `user_email`, `user_type`) 
        VALUES(%s, %s, %s, %s, %s)
    """
    values = (id, username, password, email, type)
    cursor.execute(query, values)
    conn.commit()

    cursor.close()

    return '', 204

#Send Feedback
@app.route("/api/send_feedback", methods=['POST'])
def send_feedback():
    data = request.json['data']
    name = data['name']
    title = data['title']
    email = data['email']
    enquiries = data['enquiries']
    
    query = """
        INSERT INTO `feedback`
        (`feedback_title`, `sender_name`, `sender_email`, `feedback_content`)
        VALUES (%s, %s, %s, %s)
    """
    values = (title, name, email, enquiries)
    run_query(query, values)

    return '', 204

#Get Own Profile
@app.route("/api/<string:user_type>/<int:user_id>/profile", methods=['GET'])
def get_self_profile(user_type, user_id):
    id = str(user_id)
    
    query = f"""
        SELECT `username`, `user_password`, `user_email`
        FROM user
        WHERE {user_type}_id = %s;
    """
    data = run_query(query, id)
    keys = ['username', 'password', 'email']
    profile = convert_keys(data, keys)

    return jsonify(profile)

#Get Other's Profile
@app.route("/api/profile/<string:user_type>/<int:user_id>", methods=['GET'])
def get_other_profile(user_type, user_id):

    #Query for student
    if user_type == "student":
        query = """
            SELECT student.student_name, student.student_age, student.student_email, student.student_admission, student.student_phone, user.user_profile, COUNT(DISTINCT enrollment.class_id), COUNT(DISTINCT chapter_progress.chapter_id)
            FROM user
            INNER JOIN student ON user.student_id = student.student_id
            LEFT JOIN enrollment ON enrollment.student_id = student.student_id
            LEFT JOIN chapter_progress ON chapter_progress.student_id = student.student_id
            WHERE user.student_id = %s
        """
    #Query for teacher
    else:
        query = """
            SELECT teacher.teacher_name, teacher.teacher_age, teacher.teacher_email, teacher.teacher_workplace, teacher.teacher_phone, user.user_profile, COUNT(DISTINCT class.class_id), COUNT(DISTINCT chapter.chapter_id)
            FROM user
            INNER JOIN teacher ON user.teacher_id = teacher.teacher_id
            LEFT JOIN class ON class.teacher_id = teacher.teacher_id
            LEFT JOIN chapter ON chapter.class_id = chapter.class_id
            WHERE user.teacher_id = %s
        """

    data = run_query(query, str(user_id))
    keys = ['name', 'age', 'email', 'workplace', 'phone', 'profile', 'classCount', 'chapterCount']

    user_data = convert_keys(data, keys)
    return jsonify(user_data)

#Uploading Pictures
@app.route("/api/upload_image/<string:folder_name>", methods=['POST'])
def upload_image(folder_name):
    if 'file' not in request.files:
        return jsonify({'message': 'No file selected'}), 400
    else:
        file = request.files['file']
        filename = sanitize_filename(file.filename)
        filepath = os.path.join(USER_IMAGE_FOLDER, folder_name, filename)
        file.save(filepath)
        return jsonify({'message': 'File uploaded successfully'}), 200

#Uploading Files
@app.route("/api/upload_files", methods=['POST'])
def upload_files():

    files = request.files.getlist('files') #Files are sent as list

    if len(files) == 0:
        return jsonify({'message': 'No file selected'}), 400
    else:
        for file in files:
            filename = sanitize_filename(file.filename)
            filepath = os.path.join(USER_FILE_FOLDER, filename)
            file.save(filepath)
            
        return jsonify({'message': 'Files uploaded successfully'}), 200

#Upload File Information
@app.route("/api/class/<int:class_id>/save_uploads", methods=['POST'])
def save_class_uploads(class_id):
    uploads = request.json['data']

    for upload in uploads:
        name = upload['name']
        size = upload['size']

        query = """
            INSERT INTO `class_upload`
            (`class_id`, `file_name`, `file_size`)
            VALUES (%s, %s, %s)
        """
        values = (str(class_id), name, size)
        run_query(query, values)

    return '', 204

#Delete Uploads
@app.route("/api/class/<int:class_id>/delete_uploads", methods=['POST'])
def delete_class_uploads(class_id):
    uploads = request.json['data']

    for upload in uploads:
        id = upload['id']
        name = upload['name']

        query = """
            DELETE FROM `class_upload`
            WHERE `class_id` = %s AND `upload_id` = %s
        """
        values = (str(class_id), str(id))
        run_query(query, values)

        filepath = os.path.join(USER_FILE_FOLDER, name)
        os.remove(filepath)

    return '', 204

#Get Class Uploads
@app.route("/api/class/<int:class_id>/get_uploads", methods=['GET'])
def get_class_uploads(class_id):
    query = """
        SELECT `upload_id`, `file_name`, `file_size`
        FROM `class_upload`
        WHERE `class_id` = %s
    """
    data = run_query(query, str(class_id))
    keys = ['id', 'name', 'size']
    class_data = convert_keys(data, keys)

    return jsonify(class_data)

#Download File
@app.route("/api/download_file/<string:file_name>", methods=['GET'])
def download_file(file_name):
    file_path = os.path.join(USER_FILE_FOLDER, file_name)

    # Check if the file exists
    if not os.path.exists(file_path):
        return jsonify({'message': 'File not found'}), 404

    # Send the file as a response
    return send_file(file_path, as_attachment=True)

#Save Settings
@app.route("/api/update_settings", methods=['POST'])
def update_settings():
    settings = request.json['data']
    type = request.json['type'].lower()

    id = settings['id']
    name = settings['name']
    age = settings['age']
    email = settings['email']
    workplace = settings['workplace']
    phone = settings['phone']
    profile = settings['profile']

    workplace_column = 'workplace' if type == 'teacher' else 'admission'

    query = f"""
        UPDATE `{type}`
        SET `{type}_name` = %s, `{type}_age` = %s, `{type}_email` = %s, `{type}_{workplace_column}` = %s, `{type}_phone` = %s
        WHERE `{type}_id` = %s
    """
    values = (name, age, email, workplace, phone, id)
    run_query(query, values)

    query = f"""
        UPDATE `user`
        SET `user_profile` = %s
        WHERE `{type}_id` = %s
    """
    values = (profile, id)
    run_query(query, values)

    return '', 204

#Save Profile
@app.route("/api/update_profile", methods=['POST'])
def update_profile():
    profile = request.json['data']
    type = request.json['type'].lower()
    id = request.json['id']

    username = profile['username']
    password = profile['password']
    email = profile['email']

    query = f"""
        UPDATE `user`
        SET `username` = %s, `user_password` = %s, `user_email` = %s
        WHERE `{type}_id` = %s
    """
    values = (username, password, email, id)
    run_query(query, values)

    return '', 204

#Join Class
@app.route("/api/join_class", methods=['POST'])
def join_class():
    data = request.json['data']
    class_id = str(data['classID'])
    student_id = str(data['studentID'])

    print (class_id, student_id)

    query = """
        INSERT INTO `enrollment`
        (`student_id`, `class_id`)
        VALUES (%s, %s);
    """
    values = (student_id, class_id)
    run_query(query, values)

    return '', 204

@app.route("/api/leave_class", methods=['POST'])
@app.route('/api/teacher/remove_member', methods=['POST'])
def leave_class():

    data = request.json['data']
    student_id = data['studentID']
    class_id = data['classID']

    values = (student_id, class_id)

    query1 = """
        DELETE er FROM exam_result er 
        INNER JOIN exam e ON er.exam_id = e.exam_id 
        WHERE er.student_id = %s AND e.class_id = %s;
    """

    query2 = """
        DELETE chapter_progress
        FROM chapter_progress
        INNER JOIN enrollment ON chapter_progress.student_id = enrollment.student_id
        WHERE enrollment.student_id = %s AND enrollment.class_id = %s;
    """

    query3 = """
        DELETE enrollment
        FROM enrollment
        WHERE student_id = %s AND class_id = %s;
    """

    run_query(query1, values)
    run_query(query2, values)
    run_query(query3, values)

    return '', 204

#Validate Class Code
@app.route("/api/get_class_code/<int:student_id>/<string:class_code>", methods=['GET'])
def get_class_code(student_id, class_code):
    
    query = """
        SELECT class.class_id
        FROM `class`
        WHERE class.class_code = %s AND class.class_id NOT IN (
        SELECT class_id FROM `enrollment` WHERE student_id = %s
        )
    """
    values = (class_code, str(student_id))
    data = run_query(query, values)

    if len(data) > 0: #If class are found
        return jsonify({'classFound': True, 'id': data[0]})
    else:
        return jsonify({'classFound': False})

#Leaderboard Data
@app.route("/api/get_leaderboard/<int:class_id>", methods=['GET'])
def get_leaderboard(class_id):

    query = """
        SELECT enrollment.student_id, student.student_name, user.user_profile, COUNT(DISTINCT chapter_progress.chapter_id) AS progress
        FROM enrollment
        INNER JOIN student ON student.student_id = enrollment.student_id
        INNER JOIN user ON user.student_id = student.student_id
        INNER JOIN class ON class.class_id = enrollment.class_id
        LEFT JOIN chapter_progress ON chapter_progress.student_id = enrollment.student_id
        INNER JOIN chapter ON chapter.chapter_id = chapter_progress.chapter_id AND chapter.class_id = class.class_id
        WHERE enrollment.class_id = %s
        GROUP BY enrollment.student_id, student.student_name
    """
    data = run_query(query, str(class_id))
    keys = ['id', 'name', 'profile', 'progression']

    leaderboard_data = convert_keys(data, keys)

    return jsonify(leaderboard_data)

#Get Exam Questions
@app.route("/api/get_exam_questions/<int:exam_id>", methods=['GET'])
def get_exam_questions(exam_id):

    id = str(exam_id)

    query = """
    SELECT `question_id`, `exam_question`, `question_answer`, `question_option1`, `question_option2`, `question_option3` 
    FROM `exam_question`
    WHERE `exam_id` = %s;
    """
    data = run_query(query, id)
    exam_keys = ['id', 'question', 'answer', 'option1', 'option2', 'option3']

    exam_data = convert_keys(data, exam_keys)

    return jsonify(exam_data)








#Student Dashboard
@app.route("/api/student/<int:student_id>", methods=['GET'])
def get_student(student_id):

    student_id = str(student_id)

    query = """
        SELECT `student_id`, `student_name` 
        FROM student 
        WHERE `student_id` = %s
    """
    data = run_query(query, student_id)
    keys = ['id', 'name']

    student_data = convert_keys(data, keys)

    return jsonify(student_data)

#Get All Student's Classes
@app.route("/api/student/<int:student_id>/get_classes", methods=['GET'])
def get_student_classes(student_id):
    student_id = str(student_id)

    query = """
    SELECT class.class_id, class.class_name, enrollment.date_enrolled, 
    COUNT(DISTINCT chapter.chapter_id) AS chapter_count
    FROM class
    INNER JOIN enrollment ON enrollment.class_id = class.class_id
    LEFT JOIN chapter ON chapter.class_id = enrollment.class_id
    WHERE enrollment.student_id = %s
    GROUP BY class.class_id;
    """
    data = run_query(query, student_id)
    keys = ['id', 'name', 'joined', 'chapter_count']

    class_data = convert_keys(data, keys)

    query = """
    SELECT class.class_id, COUNT(DISTINCT chapter_progress.chapter_id) AS completion_status 
    FROM class
    INNER JOIN enrollment ON enrollment.class_id = class.class_id
    LEFT JOIN chapter_progress ON chapter_progress.student_id = enrollment.student_id AND chapter_progress.chapter_id IN (
        SELECT chapter_id
        FROM chapter
        WHERE chapter.class_id = class.class_id
    )
    WHERE enrollment.student_id = %s
    GROUP BY class.class_id
    """
    data = run_query(query, student_id)
    keys = ['id', 'completion_count']

    completion_data = convert_keys(data, keys)

    page_data = {'classes': class_data, 'completion': completion_data}

    return jsonify(page_data)

#Get One Student Class
@app.route("/api/student/<int:student_id>/class/<int:class_id>", methods=['GET'])
def get_student_class(student_id, class_id):
    
    student_id = str(student_id)
    class_id = str(class_id)

    query = """
        SELECT `class_id`, `class_name`, `class_description`
        FROM `class`
        WHERE `class_id` = %s
    """
    data = run_query(query, class_id)
    keys = ['id', 'name', 'description']
    class_data = convert_keys(data, keys)

    query = """
        SELECT chapter.chapter_id, chapter.chapter_title, chapter.chapter_description
        FROM chapter
        INNER JOIN class ON class.class_id = chapter.class_id
        INNER JOIN enrollment ON enrollment.class_id = class.class_id
        WHERE class.class_id = %s AND enrollment.student_id = %s
        GROUP BY chapter.chapter_id
    """
    values = (class_id, student_id)
    data = run_query(query, values)
    keys = ['id', 'title', 'description']
    chapter_data = convert_keys(data, keys)

    query = """
        SELECT chapter.chapter_id, COUNT(chapter_progress.chapter_id) AS progress_count
        FROM chapter
        LEFT JOIN chapter_progress ON chapter.chapter_id = chapter_progress.chapter_id AND chapter_progress.student_id = %s
        WHERE chapter.class_id = %s
        GROUP BY chapter.chapter_id;
    """
    values = (student_id, class_id)
    data = run_query(query, values)
    keys = ['id', 'progress']
    progress_data = convert_keys(data, keys)

    query = """
        SELECT exam.exam_id, exam_result.exam_score, exam.date_posted
        FROM enrollment
        LEFT JOIN exam ON enrollment.class_id = exam.class_id
        LEFT JOIN exam_result ON exam.exam_id = exam_result.exam_id AND enrollment.student_id = exam_result.student_id
        WHERE enrollment.class_id = %s AND enrollment.student_id = %s;
    """
    values = (class_id, student_id)
    data = run_query(query, values)
    keys = ['id', 'score', 'posted']
    exam_data = convert_keys(data, keys)

    page_data = {'classInfo': class_data, 'chapters': chapter_data, 'progress': progress_data, 'exam': exam_data}

    return jsonify(page_data)

#Get Chapter Data
@app.route("/api/student/get_chapter/<int:chapter_id>", methods=['GET'])
def get_student_chapter(chapter_id):

    values = (chapter_id,)

    query = """
        SELECT `flashcard_id`, `flashcard_title`, `flashcard_description`
        FROM `flashcard`
        WHERE `chapter_id` = %s
    """
    data = run_query(query, values)
    keys = ['id', 'title', 'description']
    flashcard_data = convert_keys(data, keys)

    query = """
        SELECT `quiz_id`, `quiz_question`, `quiz_answer`, `quiz_option1`, `quiz_option2`, `quiz_option3`
        FROM `quiz`
        WHERE `chapter_id` = %s
    """
    data = run_query(query, values)
    keys = ['id', 'question', 'answer', 'option1', 'option2', 'option3']
    quiz_data = convert_keys(data, keys)

    page_data = {'flashcards': flashcard_data, 'quizzes': quiz_data}

    return page_data

#Update student completion status
@app.route("/api/student/update_chapter_progress", methods=['POST'])
def update_chapter_progress():

    info = request.json['data']

    student_id = info['studentID']
    chapter_id = info['chapterID']

    query = """
        INSERT INTO `chapter_progress`
        (`student_id`, `chapter_id`)
        VALUES (%s, %s)
        ON DUPLICATE KEY UPDATE
            `student_id` = VALUES(`student_id`),
            `chapter_id` = VALUES(`chapter_id`);
    """
    values = (student_id, chapter_id)
    run_query(query, values)

    return '', 204

#Update/Insert student exam results
@app.route("/api/student/update_exam_progress", methods=['POST'])
def update_exam_results():
    data = request.json['data']

    student_id = data['id']
    exam_id = data['examID']
    score = data['score']

    query = """
        INSERT INTO `exam_result`
        VALUES (%s, %s, %s)
        ON DUPLICATE KEY UPDATE
            `exam_score` = VALUES(`exam_score`)
    """
    values = (exam_id, student_id, score)
    run_query(query, values)

    return '', 204












# Teacher Dashboard
@app.route("/api/teacher/<int:teacher_id>", methods=['GET'])
def get_teacher(teacher_id):
    #Teacher table query
    id = str(teacher_id)

    query = "SELECT * FROM teacher WHERE `teacher_id` = %s"
    data = run_query(query, id)
    keys = ['id', 'name', 'age', 'email', 'workplace', 'phone']

    teacher_data = convert_keys(data, keys)

    query ="""
    SELECT class.class_id, class.class_name, class.class_code, class.date_created, COUNT(enrollment.student_id) as student_count
    FROM class 
    LEFT JOIN enrollment ON class.class_id = enrollment.class_id 
    WHERE class.teacher_id = %s 
    GROUP BY class.class_id
    """
    data = run_query(query, id)
    keys = ['id', 'name', 'code', 'created', 'count']

    class_data = convert_keys(data, keys)

    page_data = {'teacher' : teacher_data, 'classes': class_data}

    return jsonify(page_data)

@app.route("/api/teacher/add_class", methods=['POST'])
def add_class():
    conn = get_db()
    cursor = conn.cursor()

    class_info = request.json['data']

    id = class_info['id']
    name = class_info['name']

    #Null if empty string
    if (class_info['description'] == ''):
        description = None
    else:
        description = class_info['description']
        
    code = class_info['code']

    query = """
        INSERT INTO `class` 
        (`teacher_id`, `class_name`, `class_description`, `class_code`)
        VALUES (%s, %s, %s, %s)
        """
    values = (id, name, description, code)
    cursor.execute(query, values)
    conn.commit()

    #Obtain newly created class' id
    class_id = str(cursor.lastrowid)

    cursor.close()

    return jsonify(class_id)

@app.route('/api/teacher/edit_class', methods=['POST'])
def edit_class():
    
    class_info = request.json['data']
    
    id = class_info['id']
    name = class_info['name']

    #Null if empty string
    if (class_info['description'] == ''):
        description = None
    else:
        description = class_info['description']

    query = """
        UPDATE `class`
        SET `class_name` = %s, `class_description` = %s
        WHERE `class_id` = %s
        """
    values = (name, description, id)
    run_query(query, values)

    return '', 204

@app.route("/api/teacher/delete_class", methods=['POST'])
def delete_class():

    class_info = request.json['data']

    teacher_id = class_info['teacherID']
    class_id = class_info['classID']

    query = """
        DELETE FROM `class`
        WHERE (`teacher_id` = %s AND `class_id` = %s)
    """
    values = (teacher_id, class_id)
    run_query(query, values)

    return '', 204

@app.route("/api/teacher/create_chapter", methods=['POST'])
def add_chapter():
    conn = get_db()
    cursor = conn.cursor()

    class_info = request.json['id']
    chapter_data = request.json['chapter']
    flashcard_data = request.json['flashcards']
    quiz_data = request.json['quizzes']

    class_id = class_info['classID']

    #Insert chapter data first before anything else
    chapter_title = chapter_data['title']
    chapter_description = chapter_data['description']

    query = """
        INSERT INTO `chapter`
        (`class_id`, `chapter_title`, `chapter_description`)
        VALUES (%s, %s, %s)
    """
    values = (str(class_id), chapter_title, chapter_description)
    cursor.execute(query, values)
    conn.commit()

    #Get latest auto-increment value of chapter
    chapter_id = str(cursor.lastrowid)

    for flashcard in flashcard_data:
        flashcard_title = flashcard['title']
        flashcard_content = flashcard['content']

        query="""
            INSERT INTO `flashcard`
            (`chapter_id`, `flashcard_title`, `flashcard_description`)
            VALUES (%s, %s, %s)
        """
        values = (chapter_id, flashcard_title, flashcard_content)
        cursor.execute(query, values)
    #Commit After executing all
    conn.commit()

    for quiz in quiz_data:
        quiz_question = quiz['question']
        quiz_answer = quiz['answer']
        quiz_option1 = quiz['option1']
        quiz_option2 = quiz['option2']
        quiz_option3 = quiz['option3']

        query = """
            INSERT INTO `quiz`
            (`chapter_id`, `quiz_question`, `quiz_answer`, `quiz_option1`, `quiz_option2`, `quiz_option3`)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        values = (chapter_id, quiz_question, quiz_answer, quiz_option1, quiz_option2, quiz_option3)
        cursor.execute(query, values)
    conn.commit()
    cursor.close()

    return '', 204

@app.route("/api/teacher/class/<int:class_id>/edit_chapter/<int:chapter_id>", methods=['GET'])
def get_edit_chapter(class_id, chapter_id):
    class_id = str(class_id)
    chapter_id = str(chapter_id)

    values = (chapter_id, class_id)
    query = """
        SELECT chapter.chapter_title, chapter.chapter_description 
        FROM chapter
        INNER JOIN class
        ON chapter.class_id = class.class_id
        WHERE chapter.chapter_id = %s AND class.class_id = %s
    """
    data = run_query(query, values)
    keys = ['title', 'description']
    chapter_data = convert_keys(data, keys)

    query = """
        SELECT MAX(flashcard_id) FROM flashcard;
    """
    flashcard_id = run_query(query)

    query = """
        SELECT MAX(quiz_id) FROM quiz;
    """
    quiz_id = run_query(query)

    query = """
        SELECT flashcard.flashcard_id, flashcard.flashcard_title, flashcard.flashcard_description
        FROM chapter
        INNER JOIN flashcard
        INNER JOIN class
        ON flashcard.chapter_id = chapter.chapter_id
        AND chapter.class_id = class.class_id
        WHERE chapter.chapter_id = %s AND class.class_id = %s
    """
    data = run_query(query, values)
    keys = ['id', 'title', 'content']
    flashcard_data = convert_keys(data, keys)

    query = """
        SELECT quiz.quiz_id, quiz.quiz_question, quiz.quiz_answer, quiz.quiz_option1, quiz.quiz_option2, quiz.quiz_option3
        FROM chapter
        INNER JOIN quiz
        INNER JOIN class
        ON quiz.chapter_id = chapter.chapter_id
        AND chapter.class_id = class.class_id
        WHERE chapter.chapter_id = %s AND class.class_id = %s
    """
    data = run_query(query, values)
    keys = ['id', 'question', 'answer', 'option1', 'option2', 'option3']
    quiz_data = convert_keys(data, keys)

    page_data = {'chapter': chapter_data, 'flashcard_id': flashcard_id, 'quiz_id': quiz_id,'flashcards': flashcard_data, 'quizzes': quiz_data}

    return jsonify(page_data)

@app.route("/api/teacher/update_chapter", methods=['POST'])
def update_chapter():

    chapter_id = request.json['id']
    chapter_data = request.json['chapter']
    flashcard_data = request.json['flashcards']
    quiz_data = request.json['quizzes']

    chapter_title = chapter_data['title']
    chapter_description = chapter_data['description']

    query = """
        UPDATE `chapter`
        SET `chapter_title` = %s, `chapter_description` = %s
        WHERE `chapter_id` = %s
    """
    values = (chapter_title, chapter_description, chapter_id)
    run_query(query, values)

    for flashcard in flashcard_data:
        id = flashcard['id']
        title = flashcard['title']
        content = flashcard['content']

        query = """
            INSERT INTO `flashcard` (`flashcard_id`, `chapter_id`, `flashcard_title`, `flashcard_description`) 
            VALUES(%s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                `flashcard_title` = VALUES(`flashcard_title`),
                `flashcard_description` = VALUES(`flashcard_description`)
                ;
        """
        values = (id, chapter_id, title, content)
        run_query(query, values)

    for quiz in quiz_data:
        id = quiz['id']
        question = quiz['question']
        answer = quiz['answer']
        option1 = quiz['option1']
        option2 = quiz['option2']
        option3 = quiz['option3']

        query = """
            INSERT INTO `quiz` (`quiz_id`, `chapter_id`, `quiz_question`, `quiz_answer`, `quiz_option1`, `quiz_option2`, `quiz_option3`) 
            VALUES (%s, %s, %s, %s, %s, %s, %s) 
            ON DUPLICATE KEY UPDATE 
                `quiz_question` = VALUES(`quiz_question`), 
                `quiz_answer` = VALUES(`quiz_answer`), 
                `quiz_option1` = VALUES(`quiz_option1`), 
                `quiz_option2` = VALUES(`quiz_option2`), 
                `quiz_option3` = VALUES(`quiz_option3`);
        """
        values = (id, chapter_id, question, answer, option1, option2, option3)
        run_query(query, values)

    return '', 204

@app.route("/api/teacher/remove_flashcard", methods=['POST'])
def remove_flashcard():
    data = request.json['data']
    for id in data:
        query = """
            DELETE FROM `flashcard`
            WHERE `flashcard_id` = %s
        """
        run_query(query, str(id))

    return '', 204

@app.route("/api/teacher/remove_quiz", methods=['POST'])
def remove_quiz():
    data = request.json['data']
    for id in data:
        query = """
            DELETE FROM `quiz`
            WHERE `quiz_id` = %s
        """
        run_query(query, str(id))

    return '', 204


@app.route("/api/teacher/remove_chapter", methods=['POST'])
def remove_chapter():
    data = request.json['data']

    chapter_id = data['chapterID']

    query = """
        DELETE FROM `chapter` 
        WHERE `chapter_id` = %s;
    """
    values = (str(chapter_id))
    run_query(query, values)

    return '', 204

@app.route("/api/teacher/create_exam", methods=['POST'])
def add_exam():
    conn = get_db()
    cursor = conn.cursor()

    data = request.json['data']
    class_id = data['classID']
    questions = data['exam']

    query = """
        INSERT INTO `exam`
        (`class_id`)
        VALUES (%s)
    """

    values = (class_id)
    cursor.execute(query, values)
    conn.commit()

    #Get latest auto-increment value of exam
    exam_id = str(cursor.lastrowid)

    for record in questions:

        question = record['question']
        answer = record['answer']
        option1 = record['option1']
        option2 = record['option2']
        option3 = record['option3']

        query = """
            INSERT INTO `exam_question`
            (`exam_id`, `exam_question`, `question_answer`, `question_option1`, `question_option2`, `question_option3`)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        values = (exam_id, question, answer, option1, option2, option3)
        cursor.execute(query, values)
    conn.commit()
    cursor.close()

    return '', 204

@app.route("/api/teacher/class/edit_exam/<int:exam_id>", methods=['GET'])
def get_edit_exam(exam_id):

    data = run_query("""
        SELECT `question_id`, `exam_question`, `question_answer`, `question_option1`, `question_option2`, `question_option3`
        FROM `exam_question`
        WHERE `exam_id` = %s
    """, str(exam_id))

    keys = ['id', 'question', 'answer', 'option1', 'option2', 'option3']
    exam_data = convert_keys(data, keys)

    question_increment = run_query("""
        SELECT `AUTO_INCREMENT`
        FROM  INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = 'quizzeria'
        AND   TABLE_NAME   = 'exam_question';
    """)

    page_data = {'questions': exam_data, 'questionIncrement': question_increment}

    return jsonify(page_data)

@app.route("/api/teacher/update_exam", methods=['POST'])
def update_exam():
    exam_id = request.json['id']
    questions_data = request.json['questions']

    for record in questions_data:
        id = record['id']
        question = record['question']
        answer = record['answer']
        option1 = record['option1']
        option2 = record['option2']
        option3 = record['option3']

        query = """
            INSERT INTO `exam_question` 
            (`question_id`, `exam_id`, `exam_question`, `question_answer`, `question_option1`, `question_option2`, `question_option3`) 
            VALUES(%s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                `exam_id` = VALUES(`exam_id`),
                `exam_question` = VALUES(`exam_question`),
                `question_answer` = VALUES(`question_answer`),
                `question_option1` = VALUES(`question_option1`),
                `question_option2` = VALUES(`question_option2`),
                `question_option3` = VALUES(`question_option3`)
                ;
        """
        values = (id, exam_id, question, answer, option1, option2, option3)
        run_query(query, values)

    return '', 204

@app.route("/api/teacher/remove_exam", methods=['POST'])
def remove_exam():
    id = str(request.json['id'])

    query = """
        DELETE FROM `exam`
        WHERE `exam_id` = %s
    """
    run_query(query, (id,))

    return '', 204

@app.route("/api/teacher/remove_exam_question", methods=['POST'])
def remove_exam_questions():
        
    questions = request.json['data']

    for question in questions:
        id = question['id']

        query = """
            DELETE FROM `exam_question`
            WHERE `question_id` = %s;
        """
        values = (id,)
        run_query(query, values)

    return '', 204

@app.route('/api/teacher/<int:teacher_id>/class/<int:class_id>', methods=['GET'])
def get_teacher_class(teacher_id, class_id):

    teacher_id = str(teacher_id)
    class_id = str(class_id)

    query ="""
        SELECT class.*, COUNT(enrollment.class_id) as count_enrollment
        FROM class
        LEFT JOIN enrollment
        ON class.class_id = enrollment.class_id
        WHERE (class.teacher_id = %s AND class.class_id = %s)
        GROUP BY class.class_id;
    """
    values = (teacher_id, class_id)
    data = run_query(query, values)
    keys = ['id', 'teacher_id', 'name', 'description', 'code', 'created', 'count']
    class_data = convert_keys(data, keys)

    query ="""
        SELECT student.student_id, student.student_name, user.user_profile
        FROM student
        INNER JOIN user
        INNER JOIN enrollment
        INNER JOIN class
        ON student.student_id = user.student_id
        AND student.student_id = enrollment.student_id
        AND enrollment.class_id = class.class_id
        WHERE enrollment.class_id = class.class_id
        AND class.class_id = %s;
    """
    values = (class_id)
    data = run_query(query, values)
    keys = ['id', 'name', 'profile']
    member_data = convert_keys(data, keys)

    query = """
        SELECT chapter.chapter_id, chapter.chapter_title, chapter.chapter_description, chapter_progress.student_id
        FROM chapter
        LEFT JOIN chapter_progress
        ON chapter_progress.chapter_id = chapter.chapter_id
        WHERE chapter.class_id = %s;
    """
    keys = ['id', 'title', 'description', 'student_id']
    data = run_query(query, values)
    chapter_progress_data = convert_keys(data, keys)

    query = """
        SELECT `exam_id`, `date_posted`
        FROM `exam`
        WHERE `class_id` = %s
    """
    data = run_query(query, values)
    keys = ['id', 'posted']
    exam_data = convert_keys(data, keys)

    query = """
        SELECT `exam_result`.`student_id`, `exam_result`.`exam_score`
        FROM exam_result
        INNER JOIN exam ON exam_result.exam_id = exam.exam_id
        INNER JOIN class ON exam.class_id = class.class_id
        WHERE class.class_id = %s;
    """
    data = run_query(query,values)
    keys = ['student_id', 'score']
    exam_progress_data = convert_keys(data, keys)

    page_data = {'class': class_data, 'members': member_data, 'progress': chapter_progress_data, 'exam': exam_data, 'exam_progress': exam_progress_data}

    return jsonify(page_data)
















#Admin Dashboard
@app.route("/api/admin/<int:admin_id>", methods=['GET'])
def get_admin_data(admin_id):
    # Query for user table
    user_data = run_query("""
        SELECT `user_id`, `username`, `user_password`, `user_email`, `user_type`, `registered_date`, `user_status`, `admin_id` 
        FROM `user`
        WHERE `admin_id` IS NULL OR `admin_id` != %s;
    """, str(admin_id))

    user_increment = run_query("""
        SELECT `AUTO_INCREMENT`
        FROM  INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = 'quizzeria'
        AND   TABLE_NAME   = 'user';
    """)

    admin_increment = run_query("""
        SELECT `AUTO_INCREMENT`
        FROM  INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = 'quizzeria'
        AND   TABLE_NAME   = 'admin';
    """)

    # Query for feedback table
    feedback_data = run_query("SELECT * FROM `feedback`")

    admin_data = {'user': user_data, 'userIncrement': user_increment,'adminIncrement': admin_increment, 'feedback': feedback_data}

    return jsonify(admin_data)

@app.route("/api/admin/get_class", methods=['GET'])
def get_all_class():
    query = """
        SELECT COUNT(*) AS count FROM `class`
    """
    data = run_query(query)

    return jsonify(data)

@app.route("/api/admin/save_user", methods=['POST'])
def update_user_data():
    users = request.json['data']

    for user in users:
        id = user['id']

        if (user['admin_id'] == "null"):
            admin = None
        else:
            admin = user['admin_id']

        name = user['name']
        password = user['password']
        email = user['email']
        user_type = user['type']

        dt_object = datetime.strptime(user['registration'], '%a, %d %b %Y %H:%M:%S %Z')
        registration_date = dt_object.strftime('%Y-%m-%d %H:%M:%S') 

        user_status = user['status']
            
        if (admin != None):
            query = """
                INSERT INTO `admin` (`admin_id`, `admin_name`)
                VALUES (%s, %s)
                ON DUPLICATE KEY UPDATE
                    `admin_name` = VALUES(`admin_name`);
            """
            values = (admin, name)
            run_query(query, values)

        query = """
            INSERT INTO `user` (`user_id`, `admin_id`, `username`, `user_password`, `user_email`, `user_type`, `registered_date`, `user_status`) 
            VALUES(%s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                `admin_id` = VALUES(`admin_id`),
                `username` = VALUES(`username`),
                `user_password` = VALUES(`user_password`),
                `user_email` = VALUES(`user_email`),
                `user_type` = VALUES(`user_type`),
                `registered_date` = VALUES(`registered_date`),
                `user_status` = VALUES(`user_status`)
                ;
        """
        # Tuple containing values for the placeholders
        values = (id, admin, name, password, email, user_type, registration_date, user_status)
        run_query(query, values)

    return '', 204 #204 returns a 204 No Content HTTP, which indicates server processed request successfully

@app.route("/api/admin/remove_user", methods=['POST'])
def remove_user_data():
    users = request.json['data']

    for user in users:
        id = user['id']
        type = user['type']

        query = f"""
            DELETE FROM `{type}`
            WHERE `{type}_id` = (SELECT `{type}_id` FROM `user` WHERE `user_id` = %s);
        """
        values = (id,)
        run_query(query, values)

    return '', 204

@app.route("/api/admin/save_feedback", methods=['POST'])
def update_feedback_data():

    query = """
        UPDATE `feedback` 
        SET `feedback_status` = 1
        WHERE `feedback_id` = %s;
    """
    values = (request.json['id'],)
    run_query(query, values)

    #Maybe change in future 

    return '', 204

@app.route("/api/admin/delete_feedback/<int:feedback_id>", methods=['POST'])
def delete_feedback(feedback_id):
    query = """
        DELETE FROM `feedback`
        WHERE `feedback_id` = %s
    """
    run_query(query, str(feedback_id))

    return '', 204

if __name__ == "__main__":
    app.run(debug=True)