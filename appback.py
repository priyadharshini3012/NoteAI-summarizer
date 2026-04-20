from flask import Flask, request, jsonify
from flask_cors import CORS
from summarizer import summarize
import PyPDF2

app = Flask(__name__)
CORS(app)


@app.route('/')
def home():
    return "AI Summarizer API is running 🚀"


# 🔹 Helper: Split large text into chunks
def split_text(text, max_words=400):
    words = text.split()
    chunks = []

    for i in range(0, len(words), max_words):
        chunk = " ".join(words[i:i + max_words])
        chunks.append(chunk)

    return chunks


# 🔹 Helper: Convert paragraph → bullet points
def to_bullets(summary):
    sentences = summary.split(". ")
    bullets = [f"• {s.strip()}" for s in sentences if s.strip()]
    return "\n".join(bullets)


# 🔹 Get sentence length config
def get_length_config(length):
    if length == "short":
        return 2
    elif length == "long":
        return 5
    return 3


# 🔹 TEXT SUMMARIZATION
@app.route('/summarize', methods=['POST'])
def summarize_text():
    data = request.get_json()

    if not data or 'text' not in data:
        return jsonify({"error": "Please provide text"}), 400

    text = data['text'].strip()
    if not text:
        return jsonify({"error": "Empty text"}), 400

    length = data.get('length', 'medium')
    format_type = data.get('format', 'paragraph')

    num_sentences = get_length_config(length)

    try:
        chunks = split_text(text)
        final_summary = ""

        for chunk in chunks:
            final_summary += summarize(chunk, num_sentences) + " "

        final_summary = final_summary.strip()

        # Format output
        if format_type == "bullet":
            final_summary = to_bullets(final_summary)

        return jsonify({
            "summary": final_summary,
            "length": length,
            "format": format_type
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 🔹 PDF SUMMARIZATION
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

        if not text.strip():
            return jsonify({"error": "No readable text in PDF"}), 400

        length = request.form.get('length', 'medium')
        format_type = request.form.get('format', 'paragraph')

        num_sentences = get_length_config(length)

        chunks = split_text(text)
        final_summary = ""

        for chunk in chunks:
            final_summary += summarize(chunk, num_sentences) + " "

        final_summary = final_summary.strip()

        # Format output
        if format_type == "bullet":
            final_summary = to_bullets(final_summary)

        return jsonify({
            "summary": final_summary,
            "length": length,
            "format": format_type
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)