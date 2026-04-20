from transformers import BartForConditionalGeneration, BartTokenizer

MODEL_NAME = "facebook/bart-large-cnn"

# Load model and tokenizer explicitly (avoids pipeline task-name issues)
tokenizer = BartTokenizer.from_pretrained(MODEL_NAME)
model = BartForConditionalGeneration.from_pretrained(MODEL_NAME)


def summarize(text, num_sentences=3):
    if not text or not text.strip():
        return "No text provided."

    # Map num_sentences to token lengths
    if num_sentences == 2:
        max_len = 80
        min_len = 25
    elif num_sentences == 5:
        max_len = 250
        min_len = 100
    else:  # medium (3 sentences)
        max_len = 150
        min_len = 50

    try:
        # BART supports up to 1024 tokens — truncate and tokenize
        inputs = tokenizer(
            text,
            return_tensors="pt",
            max_length=1024,
            truncation=True
        )

        summary_ids = model.generate(
            inputs["input_ids"],
            max_length=max_len,
            min_length=min_len,
            length_penalty=2.0,
            num_beams=4,
            early_stopping=True,
        )

        summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        return summary

    except Exception as e:
        return f"Error during summarization: {str(e)}"
        #return f"Error during summarization: {str(e)}"