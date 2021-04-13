from flask import Flask, jsonify, render_template

app = Flask(__name__)
app.config.from_object(__name__)


@app.route("/")
def home():
    return app.send_static_file("home.html")

@app.route("/register")
def registrering():
    return app.send_static_file("registrering.html")


if __name__ == '__main__':
    app.run(debug=True)
