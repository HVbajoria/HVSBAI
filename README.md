## AI Interview :bowtie:
### Installation Instructions
1. Clone the repository:
   ```bash
    git clone https://github.com/HVbajoria/HVSBAI.git
    cd HVSBAI

2. Create a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate

3. Install the required packages:
    ```bash
    pip install -r requirements.txt
    
### How to Run
1. Set up your API keys:
  - Replace "YOUR_API_KEY" with your actual API key for Google Generative AI.
  - Replace speech_key and service_region with your Azure Cognitive Services subscription key and service region.

2. Run the script:
    ```bash
    python main.py
    
### Function Descriptions
##### stop_cb(evt)
Callback function to stop the speech recognition.

  - Parameters:
    - evt: The event that triggers the callback.

##### handle_recognized(evt)
Callback function to handle recognized speech.

  - Parameters:
    - evt: The event that triggers the callback.

##### get_doc_content(file_path)
Loads the content of a Word document.

  - Parameters:
    - file_path: Path to the .docx file.
  - Returns:
    - doc_content: The content of the document as a string.

##### convert_html_to_pdf(html_string, pdf_path)
Converts HTML content to a PDF file.

  - Parameters:
    - html_string: The HTML content to be converted.
    - pdf_path: Path where the PDF will be saved.
  - Returns:
    - bool: True if PDF generation is successful, False otherwise.

### Important Lines of Code Explained
1. **Speech Configuration:**
   ```python
    speech_key, service_region = "your_speech_key", "your_service_region"
    speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)
    audio_config = speechsdk.audio.AudioConfig(use_default_microphone=True)
    speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)

2. **Initialize Word Document:**
   ```python
   doc = Document()
   doc.add_heading('Interview Conversation', 0)

3. **Google Generative AI Configuration:**
   ```python
   genai.configure(api_key="YOUR_API_KEY")
   generation_config = {
    "temperature": 0.8,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
   }
   model = genai.GenerativeModel(
    model_name="gemini-1.5-flash-8b",
    generation_config=generation_config,
   )

5. **Speech Recognition and Response Handling:**
   ```python
   speech_recognizer.session_stopped.connect(stop_cb)
   speech_recognizer.canceled.connect(stop_cb)
   speech_recognizer.start_continuous_recognition()
   speech_recognizer.recognized.connect(lambda evt: handle_recognized(evt))

6. **Generate Feedback Report:**
   ```python
   response = chat_session.send_message(content)
   markdown_content = response.text
   html_content = markdown.markdown(markdown_content)
   pdf_path = "Report.pdf"
   if convert_html_to_pdf(html_content, pdf_path):
       print(f"PDF generated and saved at {pdf_path}")
   else:
       print("PDF generation failed")

### Conclusion
This program captures an interview conversation using Azure Cognitive Services for speech recognition, processes the conversation using Google Generative AI, and generates a feedback report in PDF format. Follow the installation and running instructions to use the program effectively.

#### Build with :sparkles: by Harshavardhan & Shambhavi
