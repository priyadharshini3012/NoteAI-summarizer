from flask import Flask, request, jsonify
from flask_cors import CORS
from summarizer import summarize
import PyPDF2

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "AI Summarizer API is running 🚀"

# 🔹 Text summarization with length control
@app.route('/summarize', methods=['POST'])
def summarize_text():
    data = request.get_json()

    if not data or 'text' not in data:
        return jsonify({"error": "Please provide text"}), 400

    text = data['text']
    length = data.get('length', 'medium')

    if length == "short":
        num_sentences = 2
    elif length == "long":
        num_sentences = 5
    else:
        num_sentences = 3

    summary = summarize(text, num_sentences)

    return jsonify({"summary": summary})


# 🔹 PDF summarization
@app.route('/summarize-pdf', methods=['POST'])
def summarize_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']

    try:
        pdf_reader = PyPDF2.PdfReader(file)
        text = ""

        for page in pdf_reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted

        length = request.form.get('length', 'medium')
        if length == "short":
            num_sentences = 2
        elif length == "long":
            num_sentences = 5
        else:
            num_sentences = 3

        summary = summarize(text, num_sentences)

        return jsonify({"summary": summary})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)