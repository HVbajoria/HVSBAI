from docx import Document
import os
import time
import markdown
import pdfkit
import os
from xhtml2pdf import pisa

import azure.cognitiveservices.speech as speechsdk
import google.generativeai as genai

def stop_cb(evt):
    """
    Callback function to stop the speech recognition.
    """
    print('CLOSING on {}'.format(evt))
    speech_recognizer.stop_continuous_recognition()
    done = True

# Creates an instance of a speech config with specified subscription key and service region.
# Replace with your own subscription key and service region (e.g., "westus").
speech_key, service_region = "1SqYpFnF9omVmv64SLIngEyn4dQyeQYOFoT30FpMTcqxMjJBZq8oJQQJ99AKACHYHv6XJ3w3AAAAACOGST0s", "eastus2"
speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)
speech_config2 = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)
audio_config = speechsdk.audio.AudioConfig(use_default_microphone=True)
speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)

# Initialize a new Word document
doc = Document()
doc.add_heading('Interview Conversation', 0)

genai.configure(api_key="AIzaSyB09O3Vt_I3YGfH1pFn5wSoVoonBRUIlqQ")

# Create the model
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

system_instruction="You are an interviewer conducting a comprehensive interview for an fresher SDE role at Unstop, focusing on assessing technical and soft skills related to Angular, Laravel, Python, communication, and problem-solving abilities, using a structured and interactive format. Engage with the candidate interactively, maintaining a realistic and conversational tone. Ask relevant questions that evaluate the candidate's qualifications, experience, skills, and cultural fit for the role. Make the questions or responses short, sweet and understandable while being professional.\n\n# Steps\n\n1. **Introduction:**\n   - Introduce yourself as Shambhavi and outline the purpose of the interview.\n   - Provide a brief overview of the SDE role at Unstop.\n\n2. **Experience and Background:**\n   - Ask the candidate about background and education qualifications.\n   - Ask about the candidate's past experience in SDE roles and software development.\n   - Discuss specific roles and responsibilities they’ve undertaken that are relevant to this position.\n\n3. **Technical Skills:**\n   - Explore the candidate’s proficiency with Angular, Laravel, and Python.\n   - Discuss their experience in developing scalable software solutions.\n\n4. **Problem-Solving and Decision-Making:**\n   - Present situational questions to evaluate their problem-solving capabilities.\n   - Inquire about challenging situations in software development and how they were resolved.\n\n5. **Leadership and Team Management:**\n   - Discuss any leadership roles the candidate has held.\n   - Inquire about their management style and experience in leading a team.\n\n6. **Cultural Fit and Company Values:**\n   - Ask questions to gauge alignment with Unstop's culture and values.\n   - Explore the candidate's understanding of Unstop's business model and challenges.\n\n7. **Closing:**\n   - Invite questions from the candidate about the role or company.\n   - Provide information on the next steps in the hiring process.\n\n# Interview Segments\n\n1. **Objective-Type Questions:**\n   - Assess the candidate's technical knowledge with tricky multiple-choice questions.\n   - Structure each question with four options, only one of which is correct.\n\n2. **Subjective Questions:**\n   - Evaluate theoretical and practical implementation knowledge through open-ended questions.\n   - Use real-life scenarios that progress from easy to difficult.\n\n3. **Role-Based Scenario Question:**\n   - Present a real-world scenario to evaluate problem-solving, communication, and interpersonal skills.\n\n4. **Behavioral Assessment:**\n   - Ask questions aimed at understanding the candidate's demeanor, attitude, and ability to perform under pressure.\n\n# Output Format\n\n- Present each segment in a clear, structured format:\n  - **Objective Questions**: \"Question text? [A] Option 1 [B] Option 2 [C] Option 3 [D] Option 4\"\n  - **Subjective and Scenario Questions**: Open-ended format with clear context and expectations.\n  - **Behavioral Questions**: Prompts designed to elicit detailed, candid responses.\n\n# Examples\n\n**Objective-Type Example**\n\n- \"Which of the following is NOT a feature of Angular?\"\n  - [A] Directives\n  - [B] MVC Architecture\n  - [C] Dependency Injection\n  - [D] Middleware Integration\n\n**Subjective Example**\n\n- \"Explain how you would implement a RESTful API in Laravel for a simple e-commerce platform. Describe your approach from design to execution.\"\n\n**Role-Based Scenario Example**\n\n- \"Imagine you’re tasked with deploying an urgent software update that resolves a critical bug affecting several live applications. How would you prioritize tasks, and communicate with stakeholders, to ensure minimal disruption?\"\n\n**Behavioral Example**\n\n- \"Describe a time when you felt overwhelmed at work. How did you handle the situation, and what was the outcome?\"\n\n# Notes\n\n- Ensure each question type effectively evaluates the designated skills.\n- Tailor scenarios to be relevant to Unstop's business model.\n- Observe the candidate's reaction to stress-inducing questions to assess emotional resilience and problem-solving ability under pressure.",
)



chat_session = model.start_chat(
    history=[],
)

print("Interview begins!")

speech_recognizer.session_stopped.connect(stop_cb)
speech_recognizer.canceled.connect(stop_cb)
speech_recognizer.start_continuous_recognition()
started = False
waiting = False

def handle_recognized(evt):
    """
    Callback function to handle recognized speech.
    """
    global new_text, waiting
    if not is_speaking:
        waiting = False
        event_str = evt.result.text
        new_text = event_str

speech_recognizer.recognized.connect(lambda evt: handle_recognized(evt))

while not done:
    new_text = "Hello!"
    time.sleep(.5)

    if (started == False and new_text == "Hello!") or (new_text != "Hello!" and started == True):
        print("User: ", new_text)
        doc.add_paragraph(f"User: {new_text}")
        candidate = new_text
        started = True
        response = chat_session.send_message(candidate)
        print("Interviewer: ", response.text)
        doc.add_paragraph(f"Interviewer: {response.text}")
        speech_config.speech_synthesis_voice_name = "en-US-AriaNeural"

        # use the default speaker as audio output.
        speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config)
        is_speaking = True
        result = speech_synthesizer.speak_text_async(response.text).get()
        is_speaking = False
        time.sleep(3)
        doc.save('Interview_Conversation.docx')
        if "Thank you for your time!" in response.text:
            done = True

# Save the document
doc.save('Interview_Conversation.docx')
print("Interview ended.")

# Reporting
def get_doc_content(file_path):
    # Load the document
    doc = Document(file_path)
    
    # Initialize an empty string to hold the document content
    doc_content = ""
    
    # Iterate through each paragraph in the document
    for paragraph in doc.paragraphs:
        # Append the paragraph text to the content string
        doc_content += paragraph.text + "\n"
    
    return doc_content

# Specify the path to your .docx file
file_path = 'Interview_Conversation.docx'

# Get the content of the document
content = get_doc_content(file_path)

# Create the model
generation_config = {
    "temperature": 0.8,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-pro",
    generation_config=generation_config,
    system_instruction="Evaluate the interview transcript for a fresher SDE role at Unstop, focusing on assessing technical and soft skills related to Angular, Laravel, Python, communication, and problem-solving abilities. Provide structured feedback and ratings for each skill, along with an overall assessment and recommendation.\n\n# Feedback Report\n\n## Skills Assessment\n\n### Angular\n- **Feedback**: [Detailed feedback on candidate's understanding and application of Angular, including specific strengths or areas for improvement.]\n- **Rating**: [X/10]\n\n### Laravel\n- **Feedback**: [Detailed feedback on candidate's knowledge and experience with Laravel, focusing on proficiency and practical application.]\n- **Rating**: [X/10]\n\n### Python\n- **Feedback**: [Insight into candidate's proficiency in Python, noting any particular skill level in coding, algorithms, or libraries.]\n- **Rating**: [X/10]\n\n### Communication\n- **Feedback**: [Evaluation of the candidate’s ability to communicate clearly and effectively, with examples if applicable.]\n- **Rating**: [X/10]\n\n### Problem-Solving\n- **Feedback**: [Assessment of the candidate's approach to problem-solving, creativity, and critical thinking.]\n- **Rating**: [X/10]\n\n## Overall Feedback\n\n- **Summary**: [A brief summary of the candidate’s overall performance, noting key strengths and areas for improvement.]\n- **Overall Rating**: [X/10]\n\n## Recommendation\n\n- **Consideration for Role**: [State whether the candidate should be considered for the SDE role based on the interview assessment. Include justification for the recommendation.]\n\n---",
)

chat_session = model.start_chat(
    history=[],
)


# Assuming `response.text` contains the markdown content
response = chat_session.send_message(content)
markdown_content = response.text

# Convert markdown to HTML
html_content = markdown.markdown(markdown_content)


def convert_html_to_pdf(html_string, pdf_path):
    with open(pdf_path, "wb") as pdf_file:
        pisa_status = pisa.CreatePDF(html_string, dest=pdf_file)
        
    return not pisa_status.err

# Generate PDF
pdf_path = "Report.pdf"
if convert_html_to_pdf(html_content, pdf_path):
    print(f"PDF generated and saved at {pdf_path}")
else:
    print("PDF generation failed")
