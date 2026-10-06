from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/menu')
def menu():
    return render_template('menu.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/reviews')
def reviews():
    return render_template('reviews.html')

@app.route('/contacts')
def contacts():
    return render_template('contacts.html')

@app.route('/api/order', methods=['POST'])
def api_order():
    data = request.get_json()
    print('Заказ:', data)
    return jsonify({"status": "ok", "message": "Заказ принят!"})

@app.route('/api/review', methods=['POST'])
def api_review():
    data = request.get_json()
    print('Отзыв:', data)
    return jsonify({"status": "ok", "message": "Спасибо за отзыв!"})

@app.route('/api/contact', methods=['POST'])
def api_contact():
    data = request.get_json()
    print('Контакт:', data)
    return jsonify({"status": "ok", "message": "Сообщение отправлено!"})

if __name__ == '__main__':
    app.run(debug=True)

