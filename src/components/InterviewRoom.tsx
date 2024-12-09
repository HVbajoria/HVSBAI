import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CameraOff, PhoneOff } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from './ui/Button';
import { useInterviewStore } from '../store/interviewStore';
import { Player } from "../player.ts";
import { Recorder } from "../recorder.ts";
import { LowLevelRTClient, SessionUpdateMessage, Voice } from "rt-client";
import { useLocation } from 'react-router-dom';
import markdown from '@wcj/markdown-to-html';
import { TranscriptMessage } from '../types/interview';

let html: string = "";
let realtimeStreaming: LowLevelRTClient;
let feedbackready: boolean = false;
let url: string = "";

export function InterviewRoom() {
  useEffect(() => {
    const loadWorklet = async () => {
      try {
        const audioContext = new (window.AudioContext || window.AudioContext)();
        await audioContext.audioWorklet.addModule('path/to/your/worklet.js');
        // Additional code to use the worklet
      } catch (error) {
        console.error('Error loading worklet module:', error);
      }
    };

    loadWorklet();
  }, []);

// funcion to save html as a html file in the same directory
function saveHtml(html: string, fileName: string) {
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  
  setTimeout(() => {
  feedbackready = false;
}, 60000);
}

async function convertHtmlToPdf(htmlContent: string) {
  html = htmlContent;
  stopTime = Date.now();
    console.log('Stop Time:', stopTime);
    differenceTime = stopTime - startTime!;
    console.log('Difference Time:', differenceTime);
    // Add the interview to history with the video URL
    addPastInterview({
      id: uuidv4(),
      role: selectedRole, // This should come from your interview setup
      skills: skills, // This should come from your interview setup
      date: new Date(),
      duration: differenceTime,
      videoUrl: url,
      status: 'completed',
      transcript: transcription,
      feedback: html
    });
    setTimeout(() => {
      realtimeStreaming.close();
    }, 50000);
    saveHtml(htmlContent, "feedback.html");
}

  let ReceivedTextContainer: HTMLDivElement | undefined = undefined;

let audioRecorder: Recorder;
let audioPlayer: Player;
let feedback: string;
const location = useLocation();
const { selectedRole, skills } = location.state || { selectedRole: '', skills: [] };
let startTime: number;
let startTimeStamp: Date;
let stopTime: number;
let differenceTime: number;
const createTranscriptMessage = (
  speaker: 'interviewer' | 'candidate',
  message: string,
  timestamp: Date
): TranscriptMessage => ({
  id: Math.random().toString(36).substr(2, 9),
  speaker,
  message,
  timestamp,
});
let transcription: TranscriptMessage[] = [];

async function start_realtime(endpoint: string, apiKey: string, deploymentOrModel: string) {
  if (isAzureOpenAI()) {
    realtimeStreaming = new LowLevelRTClient(new URL(endpoint), { key: apiKey }, { deployment: deploymentOrModel });
  } else {
    realtimeStreaming = new LowLevelRTClient({ key: apiKey }, { model: deploymentOrModel });
  }

  try {
    if (selectedRole=='Marketing Manager'){
      await realtimeStreaming.send(createConfigMessage(`Conduct an interview as Shambhavi for a Marketing Manager role at Unstop, assessing the following skills: ` + skills + ` through interactive and realistic questions. Make the responses of yours short and concise but also easy to understand. Donot give the response of the previous response in more than one short line and also without giving any feedback.

# Steps

1. **Introduction:**
   - Begin by introducing yourself as Shambhavi who is a female so speak in a female voice and clarify that you will be evaluating the candidate's fit for the Marketing Manager role.

2. **Experience and Background:**
   - Ask about the candidate's educational background and qualifications.
   - Inquire about any past experiences related to sales, highlighting significant achievements or challenges.

3. **Skills:**
   - Pose three objective multiple-choice questions to assess knowledge and logical thinking. Make sure you ask 3 questions one by one after receiving the answer and explaination of why he/she chose that answer of the previous question. 
     - Provide four options for each question.
     - Compulsory request the candidate to explain their chosen answer and don't move forward unless answered properly. 
     - Donot tell the correct answer of the question nor give explaination yourself but ask the candidate to explain why he/she chose that answer.
   - Present subjective, scenario-based questions to evaluate practical skills.

4. **Problem-Solving and Decision-Making:**
   - Present scenarios to assess the candidate's problem-solving abilities.
   - Ask about times when they faced challenging sales situations and how they resolved them.

5. **Role-Play:**
   - Engage in a role-play conversation as a hesitant and angry client named Harshavardhan, depicting frustration due to previous marketing plans and strategies used for their campaign which did not give a good result. Assess the candidate’s ability to build rapport, emphasize value, address concerns, and attempt to close the deal.
   - Follow up with atleast 3-4 questions acting like Shambhavi and as if you are conversing with the candidate to evaluate empathy, negotiation skills, and professionalism. 
   - Donot forget to close the deal. and make it conversational not asking any question after Shambhavi's conversation.

6. **Behavioral Assessment:**
   - Use behavioral questions to evaluate the candidate’s work ethic, resilience, and adaptability.

7. **Leadership and Team Management:**
   - Discuss any experience the candidate has in leadership or team management, if applicable.

8. **Cultural Fit and Company Values:**
   - Ask questions to understand the candidate’s alignment with Unstop’s culture and values.
   - Explore the candidate’s understanding of Unstop’s business model and the challenges it faces.

9. **Closing:**
   - Invite the candidate to ask any questions they may have about the role or company.
   - Explain the next steps in the hiring process and provide any additional information needed.

# Output Format

Questions are posed in the context of an interactive interview, requiring conversational responses from the candidate. Include direct questions, brief scenario descriptions, and prompts for candidate explanations where needed. Don't give explanations yourself.`));
      
      // skills.push('SEO & SEM');
      // skills.push('Market Research');
      // skills.push('People Skills');
      // skills.push('Partner Management');
      // skills.push('Communication');
      // skills.push('Problem-Solving');
     }
    else if (selectedRole=='Marketing Manager (Long Form)'){
      await realtimeStreaming.send(createConfigMessage(`Conduct an interview as Shambhavi for a Marketing Manager role at Unstop, assessing the following skills: ` + skills + ` through interactive and realistic questions. Make the responses of yours short and concise but also easy to understand. Do not give the response of the previous response in more than one short line and also without giving any feedback. 

        # Steps
        
        1. **Introduction:**
           - Begin by introducing yourself as Shambhavi who is a female so speak in a female voice and clarify that you will be evaluating the candidate's fit for the Marketing Manager role.
        
        2. **Experience and Background:**
           - Ask about the candidate's educational background and qualifications along with the candidate’s name and current position.
           - Inquire about any past experiences related to marketing, highlighting significant achievements or challenges.
        
        3. **Skills:**
           - Pose six objective multiple-choice questions to assess knowledge and logical thinking. Make sure you ask six questions one by one after receiving the answer and explanation of why he/she chose that answer of the previous question. Make the questions related to one another and based on the previous answer. 
             - Provide four options for each question.
             - Compulsory request to the candidate to explain their chosen answer and don't move forward unless answered properly. 
             - Do not tell the correct answer of the question nor give explanation yourself but ask the candidate to explain why he/she chose that answer.
             - Present three subjective, scenario-based questions to evaluate practical skills covering the skills:  ` + skills + `using practical methods and also real -life scenarios. 
             - Dive deep into the concepts and the solution to understand the knowledge of the candidate and assess the candidate’s skills. 
        
        4. **Problem-Solving and Decision-Making:**
           - Present scenarios to assess the candidate's problem-solving abilities.
           - Ask about times when they faced challenging marketing situations and how they resolved them.
           - Dive deep into the challenges and the solution to understand the impact created and access the candidate’s skills. 
        
        5. **Role-Play:**
           - Engage in a role-play conversation as a hesitant and angry client named Harshavardhan, depicting frustration due to previous marketing plans and strategies used for their campaign which did not give a good result. Assess the candidate’s ability to build rapport, emphasize value, address concerns, and attempt to close the deal.
           - Follow up with at least 10-12 questions acting like Shambhavi and as if you are conversing with the candidate to evaluate empathy, negotiation skills, and professionalism while diving deep into the conversation with specific details. 
           - Do not forget to close the deal. and make it conversational by not asking any question after Shambhavi's conversation.
        
        6. **Behavioral Assessment:**
           - Use behavioral questions to evaluate the candidate’s work ethic, resilience, and adaptability.
        
        7. **Leadership and Team Management:**
           - Discuss any experience the candidate has in leadership or team management, if applicable.
        
        8. **Cultural Fit and Company Values:**
           - Ask questions to understand the candidate’s alignment with Unstop’s culture and values.
           - Explore the candidate’s understanding of Unstop’s business model and the challenges it faces.
        
        9. **Closing:**
           - Invite the candidate to ask any questions they may have about the role or company.
           - Explain the next steps in the hiring process and provide any additional information needed.
        
        # Output Format
        Questions are posed in the context of an interactive interview, requiring conversational responses from the candidate. Include direct questions, brief scenario descriptions, and prompts for candidate explanations where needed. Don't give explanations yourself. Make sure that all the questions are related to one another and dive deep into them to understand the concepts and clarity of the candidate in real-world scenarios.`));
    }
    else if (selectedRole=='Marketing Manager (Demo)'){
      await realtimeStreaming.send(createConfigMessage(`Conduct an interview as Shambhavi for a Marketing Manager role at Unstop, assessing the following skills: ` + skills + ` through interactive and realistic questions. Make the responses of yours short and concise but also easy to understand. Do not give the response of the previous response in more than one short line and also without giving any feedback. 

      # Steps

      1. **Introduction:**
        - Begin by introducing yourself as Shambhavi who is a female so speak in a female voice and clarify that you will be evaluating the candidate's fit for the Marketing Manager role.

      2. **Experience and Background:**
        - Ask about the candidate's educational background and qualifications along with the candidate’s name and current position.
        - Inquire about any past experiences related to marketing, highlighting significant achievements or challenges.

      3. **Skills:**
        - Do not tell the correct answer of the question nor give an explanation yourself but ask the candidate to explain why he/she chose that answer.
        - Compulsory request to the candidate to explain their chosen answer and don't move forward unless answered properly. 
        - If a candidate is silent for 30 seconds, ask the candidate to give the answer for the respective question.
        - Ask the questions one by one and wait for the candidate to give the answer for the first question and then ask the second question. 

        Question 1: What is the most critical first step when creating a marketing strategy for a new product?
          A) Defining the target audience
          B) Designing promotional materials
          C) Analyzing competitor pricing
          D) Launching a social media campaign

        Question 2: A marketing manager observes a drop in conversion rates from an online campaign. What should be their first course of action?
          A) Increase the advertising budget
          B) Analyze the campaign’s performance metrics
          C) Switch to a different marketing channel
          D) Conduct a survey to gather customer feedback

        Question 3: Your team proposes three different campaign ideas, each with its own merits. How should you decide which one to implement?
          A) Go with the majority vote from the team
          B) Choose the idea with the lowest cost
          C) Analyze alignment with business goals and expected ROI
          D) Select the most innovative idea

        - Present subjective, scenario-based questions to evaluate practical skills covering the skills: ` + skills + ` using practical methods and also real-life scenarios. 
        - Dive deep into the concepts and the solution to understand the knowledge of the candidate and assess the candidate’s skills. 

        Subjective Question: 
        Describe the question first and then ask the sub-question one by one. Ask the first question and then wait for the candidate to answer. Then proceed with the next question.
        Dive deep into the concepts and the solution to understand the knowledge of the candidate and assess the candidate’s skills. 

        Question: As a marketing manager, you are tasked with optimizing the performance of a digital ad campaign that is underperforming: 
        Explain the steps you would take to diagnose the issues.
        The tools or platforms you would use to gather insights.
        How you would implement changes to improve the campaign's effectiveness.

      4. **Problem-Solving and Decision-Making:**
        - Present scenarios to assess the candidate's problem-solving abilities.
        - Ask about times when they faced challenging marketing situations and how they resolved them.
        - Dive deep into the challenges and the solution to understand the impact created and access the candidate’s skills. 

      5. **Role-Play:**
        Scenario: Harshavardhan, a client, is frustrated with the poor results of previous marketing strategies implemented for their campaign. The candidate, playing the role of a marketing manager, must address their concerns, build trust, and attempt to present a plan to regain confidence.
        - Engage in a role-play conversation as a hesitant and angry client named Harshavardhan, depicting frustration due to previous marketing plans and strategies used for their campaign which did not give a good result. Assess the candidate’s ability to build rapport, emphasize value, address concerns, and attempt to close the deal.
        - Follow up with at least 10-12 questions acting like Shambhavi and as if you are conversing with the candidate to evaluate empathy, negotiation skills, and professionalism while diving deep into the conversation with specific details. 
        - Do not forget to close the deal and make it conversational by not asking any question after Shambhavi's conversation.

      6. **Behavioral Assessment:**
        - Use behavioral questions to evaluate the candidate’s work ethic, resilience, and adaptability.

      7. **Leadership and Team Management:**
        - Discuss any experience the candidate has in leadership or team management, if applicable.

      8. **Cultural Fit and Company Values:**
        - Ask questions to understand the candidate’s alignment with Unstop’s culture and values.
        - Explore the candidate’s understanding of Unstop’s business model and the challenges it faces.

      9. **Closing:**
        - Invite the candidate to ask any questions they may have about the role or company.
        - Explain the next steps in the hiring process and provide any additional information needed.

      # Output Format
      Questions are posed in the context of an interactive interview, requiring conversational responses from the candidate. Include direct questions, brief scenario descriptions, and prompts for candidate explanations where needed. Don't give explanations yourself. Make sure that all the questions are related to one another and dive deep into them to understand the concepts and clarity of the candidate in real-world scenarios.`));
     }
    else if(selectedRole=='Sales Executive'){
      await realtimeStreaming.send(createConfigMessage(`Conduct an interview as Harshavardhan for a Sales Executive role at Unstop, assessing the following skills: ` + skills + ` through interactive and realistic questions. Make the responses of yours short and concise but also easy to understand. Donot give the response of the previous response in more than one short line and also without giving any feedback.

# Steps

1. **Introduction:**
   - Begin by introducing yourself as Harshavardhan who is a male so speak in a male voice and clarify that you will be evaluating the candidate's fit for the Sales Executive role.

2. **Experience and Background:**
   - Ask about the candidate's educational background and qualifications.
   - Inquire about any past experiences related to sales, highlighting significant achievements or challenges.

3. **Skills:**
   - Pose three objective multiple-choice questions to assess knowledge and logical thinking. Make sure you ask 3 questions one by one after receiving the answer and explaination of why he/she chose that answer of the previous question. 
     - Provide four options for each question.
     - Compulsory request the candidate to explain their chosen answer and don't move forward unless answered properly. 
     - Donot tell the correct answer of the question nor give explaination yourself but ask the candidate to explain why he/she chose that answer.
   - Present subjective, scenario-based questions to evaluate practical skills.

4. **Problem-Solving and Decision-Making:**
   - Present scenarios to assess the candidate's problem-solving abilities.
   - Ask about times when they faced challenging sales situations and how they resolved them.

5. **Role-Play:**
   - Engage in a role-play conversation as a hesitant client named Shambhavi, depicting frustration due to previous service issues. Assess the candidate’s ability to build rapport, emphasize value, address concerns, and attempt to close the deal.
   - Follow up with atleast 3-4 questions acting like Shambhavi and as if you are conversing with the candidate to evaluate empathy, negotiation skills, and professionalism. 
   - Donot forget to close the deal. and make it conversational not asking any question after Shambhavi's conversation.

6. **Behavioral Assessment:**
   - Use behavioral questions to evaluate the candidate’s work ethic, resilience, and adaptability.

7. **Leadership and Team Management:**
   - Discuss any experience the candidate has in leadership or team management, if applicable.

8. **Cultural Fit and Company Values:**
   - Ask questions to understand the candidate’s alignment with Unstop’s culture and values.
   - Explore the candidate’s understanding of Unstop’s business model and the challenges it faces.

9. **Closing:**
   - Invite the candidate to ask any questions they may have about the role or company.
   - Explain the next steps in the hiring process and provide any additional information needed.

# Output Format

Questions are posed in the context of an interactive interview, requiring conversational responses from the candidate. Include direct questions, brief scenario descriptions, and prompts for candidate explanations where needed. Don't give explanations yourself.`));
      // skills.push('Revenue Generation');
      // skills.push('Client Relationship Building');
      // skills.push('Contribution to Company Growth');
      // skills.push('Communication Skills');
      // skills.push('Problem-Solving Abilities');
    }
    else if (selectedRole=='SDE'){
      await realtimeStreaming.send(createConfigMessage(`Conduct an interview as Harshavardhan for a Software Development Engineer role at Unstop, assessing the following skills: ` + skills + ` through interactive and realistic questions. Make the responses of yours short and concise but also easy to understand. Donot give the response of the previous response in more than one short line and also without giving any feedback.

# Steps

1. **Introduction:**
   - Begin by introducing yourself as Harshavardhan who is a male so speak in a male voice and clarify that you will be evaluating the candidate's fit for the Software Development Engineer role.

2. **Experience and Background:**
   - Ask about the candidate's educational background and qualifications.
   - Inquire about any past experiences related to sales, highlighting significant achievements or challenges.

3. **Skills:**
   - Pose three objective multiple-choice questions to assess knowledge and logical thinking. Make sure you ask 3 questions one by one after receiving the answer and explaination of why he/she chose that answer of the previous question. 
     - Provide four options for each question.
     - Compulsory request the candidate to explain their chosen answer and don't move forward unless answered properly. 
     - Donot tell the correct answer of the question nor give explaination yourself but ask the candidate to explain why he/she chose that answer.
   - Present subjective, scenario-based questions to evaluate practical skills.

4. **Problem-Solving and Decision-Making:**
   - Present scenarios to assess the candidate's problem-solving abilities.
   - Ask about times when they faced challenging sales situations and how they resolved them.

5. **Role-Play:**
   - Engage in a role-play conversation as a hesitant and angry product manager named Shambhavi, depicting frustration due to previous product delivery and functional issues. Assess the candidate’s ability to build rapport, emphasize value, address concerns, and attempt to close the deal.
   - Follow up with atleast 3-4 questions acting like Shambhavi and as if you are conversing with the candidate to evaluate empathy, negotiation skills, and professionalism. 
   - Donot forget to close the deal. and make it conversational not asking any question after Shambhavi's conversation.

6. **Behavioral Assessment:**
   - Use behavioral questions to evaluate the candidate’s work ethic, resilience, and adaptability.

7. **Leadership and Team Management:**
   - Discuss any experience the candidate has in leadership or team management, if applicable.

8. **Cultural Fit and Company Values:**
   - Ask questions to understand the candidate’s alignment with Unstop’s culture and values.
   - Explore the candidate’s understanding of Unstop’s business model and the challenges it faces.

9. **Closing:**
   - Invite the candidate to ask any questions they may have about the role or company.
   - Explain the next steps in the hiring process and provide any additional information needed.

# Output Format

Questions are posed in the context of an interactive interview, requiring conversational responses from the candidate. Include direct questions, brief scenario descriptions, and prompts for candidate explanations where needed. Don't give explanations yourself.`));
      // skills.push('Angular');
      // skills.push('Laravel');
      // skills.push('Python');
      // skills.push('Communication');
      // skills.push('Problem-Solving');
    }
    else
      await realtimeStreaming.send(createConfigMessage("You are Harshavardhan, an interviewer for" + selectedRole + "role at Unstop, focused on assessing key skills of the candidate using structured segments like introductions, objective and subjective questions, role-play scenarios, and behavioral evaluations to gauge the candidate's fit and abilities."));
  } catch (error) {
    console.log(error);
    makeNewTextBlock("[Connection error]: Unable to send initial config message. Please check your endpoint and authentication details.");
    return;
  }
  // console.log("sent");
  await Promise.all([resetAudio(true), handleRealtimeMessages()]);
}

function createConfigMessage(instruction: string) : SessionUpdateMessage {

  let configMessage : SessionUpdateMessage = {
    type: "session.update",
    session: {
      "voice": "echo",
      "instructions": instruction,
      "input_audio_format": "pcm16",
      "input_audio_transcription": {
        "model": "whisper-1"
      },
      "turn_detection": {
        "threshold": 0.7,
        "silence_duration_ms": 1500,
        "type": "server_vad"
      },
    }
  };

  // const systemMessage = 
  const temperature = getTemperature();
  const voice = getVoice();

  // if (systemMessage) {
  //   configMessage.session.instructions = systemMessage;
  // }
  if (!isNaN(temperature)) {
    configMessage.session.temperature = temperature;
  }
  if (voice) {
    configMessage.session.voice = voice;
  }

  return configMessage;
}

async function handleRealtimeMessages() {
  ReceivedTextContainer = document.querySelector<HTMLDivElement>(
    "#received-text-container",
  )!;
  for await (const message of realtimeStreaming.messages()) {
    let consoleLog = "" + message.type;

    switch (message.type) {
      case "session.created":
        makeNewTextBlock();
        break;
      case "response.audio_transcript.delta":
        appendToTextBlock(message.delta);
        break;
      case "response.audio.delta":
        const binary = atob(message.delta);
        const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
        const pcmData = new Int16Array(bytes.buffer);
        if(!feedbackready)
        audioPlayer.play(pcmData);
        break;

      case "input_audio_buffer.speech_started":
        if(!feedbackready){
          let textElements = ReceivedTextContainer.children;
          latestInputSpeechBlock = textElements[textElements.length - 1];
          makeNewTextBlock();
          audioPlayer.clear();
        }
        break;
      case "conversation.item.input_audio_transcription.completed":
        const Content=message.transcript;
        latestInputSpeechBlock.classList.add("user-prompts");
        latestInputSpeechBlock.innerHTML += " <b>User:</b><br>" + Content + "<br> <b>Interviewer:</b> ";
        const currentTimestamp = new Date();
        const hoursDifference = Math.floor((currentTimestamp.getTime() - startTimeStamp.getTime()) / (1000 * 60 * 60));
        const minutesDifference = Math.floor((currentTimestamp.getTime() - startTimeStamp.getTime()) / (1000 * 60)) % 60;
        const secondsDifference = Math.floor((currentTimestamp.getTime() - startTimeStamp.getTime()) / 1000) % 60;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to today's date at 00:00:00

        const timestamp = new Date(today.getTime() + hoursDifference * 60 * 60 * 1000 + minutesDifference * 60 * 1000 + secondsDifference * 1000);
        // console.log("Timestamp: ", timestamp);
        if(!feedbackready)
        transcription.push(createTranscriptMessage('candidate', Content, timestamp));
        break;
      case "response.done":
        ReceivedTextContainer.appendChild(document.createElement("hr"));
        makeNewTextBlock();
        break;
      default:
        consoleLog = JSON.stringify(message, null, 2);
        break
    }
    if (consoleLog) { 
        if (consoleLog.includes("response.output_item.done")) {
          const response = JSON.parse(consoleLog);
          const transcript = response.item.content[0].transcript;
          feedback = transcript;
          if (feedbackready){
            const html = markdown(feedback);
            convertHtmlToPdf(html.toString());
            // feedbackready = false;
          }
          const currentTimestamp = new Date();
          const hoursDifference = Math.floor((currentTimestamp.getTime() - startTimeStamp.getTime()) / (1000 * 60 * 60));
          const minutesDifference = Math.floor((currentTimestamp.getTime() - startTimeStamp.getTime()) / (1000 * 60)) % 60;
          const secondsDifference = Math.floor((currentTimestamp.getTime() - startTimeStamp.getTime()) / 1000) % 60;
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Set to today's date at 00:00:00

          const timestamp = new Date(today.getTime() + hoursDifference * 60 * 60 * 1000 + minutesDifference * 60 * 1000 + secondsDifference * 1000);
          // console.log("Timestamp: ", timestamp);
          if(!feedbackready)
          transcription.push(createTranscriptMessage('interviewer', transcript, timestamp));
        }
        console.log(consoleLog);
    }
  }
  resetAudio(false);
}

/**
 * Basic audio handling
 */

let recordingActive: boolean = false;
let buffer: Uint8Array = new Uint8Array();

function combineArray(newData: Uint8Array) {
  const newBuffer = new Uint8Array(buffer.length + newData.length);
  newBuffer.set(buffer);
  newBuffer.set(newData, buffer.length);
  buffer = newBuffer;
}

function processAudioRecordingBuffer(data: Buffer) {
  const uint8Array = new Uint8Array(data);
  combineArray(uint8Array);
  if (buffer.length >= 4800) {
    const toSend = new Uint8Array(buffer.slice(0, 4800));
    buffer = new Uint8Array(buffer.slice(4800));
    const regularArray = String.fromCharCode(...toSend);
    const base64 = btoa(regularArray);
    if (recordingActive && !feedbackready) {
      realtimeStreaming.send({
        type: "input_audio_buffer.append",
        audio: base64,
      });
    }
  }

}

async function resetAudio(startRecording: boolean) {
  recordingActive = false;
  if (audioRecorder) {
    audioRecorder.stop();
  }
  if (audioPlayer) {
    audioPlayer.clear();
  }
  audioRecorder = new Recorder(processAudioRecordingBuffer);
  audioPlayer = new Player();
  audioPlayer.init(24000);
  if (startRecording) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioRecorder.start(stream);
    recordingActive = true;
  }
}

/**
 * UI and controls
 */

let latestInputSpeechBlock: Element;

function isAzureOpenAI(): boolean {
  return true;
}

// function getSystemMessage(): string {
//   return  "";
// }

function getTemperature(): number {
  return 0.8;
}

function getVoice(): Voice {
  if (selectedRole == 'SDE')
    return "echo" as Voice;
  else if (selectedRole == 'Marketing Manager')
    return "shimmer" as Voice;
  else if (selectedRole == 'Sales Executive')
    return "echo" as Voice;
  else
  return "shimmer" as Voice;
}

function makeNewTextBlock(text: string = "") {
  let newElement = document.createElement("p");
  newElement.textContent = text;
  ReceivedTextContainer?.appendChild(newElement);
}

function appendToTextBlock(text: string) {
  let textElements = ReceivedTextContainer?.children;
  if (!textElements || textElements.length === 0) {
    makeNewTextBlock();
    textElements = ReceivedTextContainer?.children;
  }
  if (textElements && textElements.length > 0) {
    textElements[textElements.length - 1].textContent += text;
  }
}

  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isVideoOn, setIsVideoOn] = useState(true);
  // const [isAudioOn, setIsAudioOn] = useState(true);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const { addPastInterview } = useInterviewStore();

  useEffect(() => {
    requestMediaPermissions();
    return () => {
      stopMediaStream();
    };
  }, []);

  const requestMediaPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setupMediaRecorder(stream);
    } catch (err) {
      console.error('Error accessing media devices:', err);
    }
  };

  const setupMediaRecorder = (stream: MediaStream) => {
    startTime = Date.now();
    console.log('Start Time:', startTime);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp8,opus',
    });
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      url = URL.createObjectURL(blob);
      
    };
  };

  const toggleVideo = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoOn;
      });
      setIsVideoOn(!isVideoOn);
    }
  };

  // const toggleAudio = () => {
  //   if (videoRef.current?.srcObject) {
  //     const stream = videoRef.current.srcObject as MediaStream;
  //     stream.getAudioTracks().forEach((track) => {
  //       track.enabled = !isAudioOn;
  //     });
  //     setIsAudioOn(!isAudioOn);
  //   }
  // };
  const stopMediaStream = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      videoRef.current.srcObject = null;
    }
  };

  const startInterview = async () => {
    startTimeStamp = new Date();
    setIsInterviewStarted(true);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      mediaRecorderRef.current.start();
    }
    const endpoint = "https://hvcodequarry.openai.azure.com/openai/realtime?api-version=2024-10-01-preview&deployment=gpt-4o-realtime-preview"
    const key = "8946fd734a33456a9edf88ed33211d21";
    const deploymentOrModel = "gpt-4o-realtime-preview";

    if (isAzureOpenAI() && !endpoint && !deploymentOrModel) {
      alert("Endpoint and Deployment are required for Azure OpenAI");
      return;
    }

    if (!isAzureOpenAI() && !deploymentOrModel) {
      alert("Model is required for OpenAI");
      return;
    }

    if (!key) {
      alert("API Key is required");
      return;
    }

    try {
      start_realtime(endpoint, key, deploymentOrModel);
    } catch (error) {
      console.log(error);
    }
    realtimeStreaming.send(
      {
        "type":"conversation.item.create",
        "item":{
           "type":"message",
           "role":"user",
           "content":[
              {
                 "type":"input_text",
                 "text":"Hello!"
              }
           ]
        }
     });
     realtimeStreaming.send({
      type: "response.create",
    });
  };

  const endInterview = async() => {
    feedbackready = true;
    let feedbackPrompt = `Evaluate the candidate's following skills: ` + skills + ` based on the provided criteria and generate a detailed report.

# Steps

1. **Gather Information:** Review the candidate's resume, cover letter, interview notes, and any test results to understand their capabilities in each skill area.
2. **Assess Skills:** Rate each skill on a scale of 1 to 10, providing supporting observations and evidence for the rating given.
3. **Provide Feedback:** Offer detailed feedback for each skill, including strengths, areas for improvement, and any relevant examples.
4. **Conclusion:** Summarize whether the candidate is fit for the role based on their skills and provide overall feedback.

# Output Format

- Use Markdown formatting to present your analysis.
- Rate each skill out of 10.
- Provide a summary of the candidate's fit for the role.

# Examples

**Candidate Skills Evaluation Report**

**Candidate Name:** [Candidate Name]  
**Position:** [Position Title]  

## Skills Assessment

### Negotiation
- **Rating:** [8/10]
- **Comments:** The candidate demonstrated strong negotiation skills during the interview, showcasing the ability to find mutually beneficial solutions. [Provide additional evidence or examples if available.]

### Customer Handling
- **Rating:** [7/10]
- **Comments:** Effective in managing customer inquiries and complaints. They provided examples of successfully resolving challenging situations. [Add any relevant details from their experience or interview.]

### Business Development
- **Rating:** [9/10]
- **Comments:** The candidate has a proven track record of identifying and pursuing new business opportunities. [Mention any specific achievements or metrics if provided.]

### Communication
- **Rating:** [6/10]
- **Comments:** While generally clear, there is room for improvement in adapting communication style to different audiences. [Elaborate with any specific observations or feedback.]

### Problem-solving Capabilities
- **Rating:** [7/10]
- **Comments:** Demonstrated competent problem-solving skills with logical and structured thinking. [Add examples or scenarios where this was evident.]

## Overall Feedback
The candidate possesses a strong potential for the role, particularly in business development and negotiation. While their communication skills could be refined, their ability to handle customers effectively makes them a good fit for the team.

---

# Notes

- Ensure each skill assessment is backed by specific evidence or examples where possible.
- Maintain objectivity and clarity throughout the report.
- Highlight any discrepancies or gaps between the candidate's skills and the role requirements, if any.`;
// if ( selectedRole == 'Marketing Manager')
//   feedbackPrompt = 'Provide a detailed evaluation of the Marketing Manager candidate\'s interview, assessing their technical and soft skills. Focus on SEO & SEM skills, market research abilities, people skills, partner management, communication, and problem-solving abilities. # Steps 1. **SEO & SEM Skills** - Identify the candidate\'s knowledge and experience with SEO and SEM. - Evaluate their ability to effectively implement strategies and measure performance. 2. **Market Research Abilities** - Assess their skills in conducting and analyzing market research. - Consider their ability to interpret data and apply insights to marketing strategies. 3. **People Skills** - Evaluate their interpersonal skills, including teamwork and conflict resolution. - Consider their ability to lead and motivate others. 4. **Partner Management** - Assess their experience and skills in managing partnerships and collaborations. - Evaluate their strategic thinking and negotiation abilities. 5. **Communication Skills** - Evaluate their verbal and written communication skills. - Consider their ability to clearly and persuasively convey ideas. 6. **Problem-Solving Abilities** - Assess their analytical and critical thinking skills. - Consider examples of how they have solved problems in past roles. 7. **Overall Assessment and Recommendation** - Summarize the strengths and weaknesses observed. - Provide a recommendation on whether to proceed with the candidate. # Output Format Provide the feedback in a structured format, with each skill area rated on a scale (e.g., 1 to 5, with 5 being excellent). Include a short summary for each skill, supported by observed examples. Conclude with an overall assessment and recommendation paragraph. ## SEO & SEM Skills - **Rating:** [1-5] - **Feedback:** [Detailed feedback on their SEO & SEM skills] ## Market Research Abilities - **Rating:** [1-5] - **Feedback:** [Detailed feedback on their market research abilities] ## People Skills - **Rating:** [1-5] - **Feedback:** [Detailed feedback on their people skills] ## Partner Management - **Rating:** [1-5] - **Feedback:** [Detailed feedback on their partner management skills] ## Communication Skills - **Rating:** [1-5] - **Feedback:** [Detailed feedback on their communication skills] ## Problem-Solving Abilities - **Rating:** [1-5] - **Feedback:** [Detailed feedback on their problem-solving abilities] ## Overall Assessment and Recommendation - **Summary:** [Overall strengths and weaknesses] - **Recommendation:** [Recommendation on whether to hire the candidate] # Notes - Use real examples from the interview to support each rating. - Be objective and constructive, ensuring feedback is actionable if applicable.';
// else if (selectedRole == 'SDE')
//   feedbackPrompt = 'Evaluate the interview that you took now for the fresher SDE role at Unstop, focusing on assessing technical and soft skills related to Angular, Laravel, Python, communication, and problem-solving abilities. Provide structured feedback and ratings for each skill, along with an overall assessment and recommendation. # Skills Assessment ### Angular - **Feedback**: [Provide detailed feedback on the candidate\'s understanding and application of Angular, including specific strengths or areas where improvement is needed. Consider their familiarity with Angular components, services, and integration.] - **Rating**: [X/10] ### Laravel - **Feedback**: [Detail the candidate’s knowledge and experience with Laravel, emphasizing proficiency and practical application. Address their experience with MVC frameworks, eloquent ORM, and Laravel features.] - **Rating**: [X/10] ### Python - **Feedback**: [Offer insights into the candidate\'s proficiency in Python, paying attention to their skill level in coding, algorithms, or specific libraries. Mention their ability to solve problems efficiently using Python.] - **Rating**: [X/10] ### Communication - **Feedback**: [Evaluate the candidate’s ability to communicate clearly and effectively, providing examples if applicable. Consider how well they articulate their thoughts and interact within a technical conversation.] - **Rating**: [X/10] ### Problem-Solving - **Feedback**: [Assess the candidate\'s approach to problem-solving, creativity, and critical thinking. Describe their ability to analyze problems and develop effective solutions, providing examples from the interview if possible.] - **Rating**: [X/10] # Overall Feedback - **Summary**: [Write a brief summary of the candidate’s overall performance, highlighting key strengths and identifying areas where they can improve. Consider the balance of technical and soft skills.] - **Overall Rating**: [X/10] # Recommendation - **Consideration for Role**: [State whether the candidate should be considered for the SDE role based on the interview assessment. Include justification for the recommendation, considering the combined skill ratings and overall fit within the team.] # Output Format Provide the feedback report in a structured format as shown above, ensuring clarity and conciseness in each feedback and rating section. Also only generate report if there is enough interaction between the candidate and the interviewer.';

await realtimeStreaming.send(createConfigMessage(feedbackPrompt));

console.log('Feedback config has been sent');
  resetAudio(false);
  realtimeStreaming.send(
    {
      "type":"conversation.item.create",
      "item":{
         "type":"message",
         "role":"user",
         "content":[
            {
               "type":"input_text",
               "text":"Could you please share me the detailed evaluation report of the candidate and if he/she is eligible for the role or not. Also analysis on each and every question. Only give the report when there is enough interaction with the candidate."
            }
         ]
      }
   });
   if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
    mediaRecorderRef.current.stop();
  }
  stopMediaStream();
  await setTimeout(() => {
    realtimeStreaming.send({
      type: "response.create",
    });
  }, 700);
  navigate('/interview-history');
  };

  return (<React.Fragment>

<div className="h-screen bg-gray-900 text-white">
      <div className="header">
        <img className="un_logo" src="https://d8it4huxumps7.cloudfront.net/uploads/images/unstop/svg/unstop-logo-white.svg"
          width="80" />
      </div>
      <div className="wrapper flex">
        <div className="flex flex-col p-4 gap-4 h-full w-full w-[calc(100%-610px)]">
          <div className="wrapper_inner flex">
            <div className={`box ${isInterviewStarted ? 'ripple' : ''}`}>
                <img src={selectedRole === 'Marketing Manager' ? "https://d8it4huxumps7.cloudfront.net/uploads/images/675281c5e9d27_shambhavi_gupta.jpeg" : 
                  "https://d8it4huxumps7.cloudfront.net/uploads/images/674d4a4ad369d_harshavardhan_bajoria.jpg" }
                  alt="AI Interviewer"
                  className="circle-img"
                />
              
                <div  className={`bars ${isInterviewStarted ? '' : 'd-none'}`}>
                  <div className="bar animate"></div>
                  <div className="bar animate"></div>
                  <div className="bar animate"></div>
                  <div className="bar animate"></div>
                  <div className="bar animate"></div>
                  <div className="bar animate"></div>
                </div>
              
              
            </div>
            <div className="box relative ">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover rounded-lg bg-gray-800"
              />
              <div className="absolute bottom-4  space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleVideo}
                  className="bg-gray-800/50 hover:bg-gray-700/50"
                >
                  {isVideoOn ? (
                    <Camera className="h-5 w-5" />
                  ) : (
                    <CameraOff className="h-5 w-5" />
                  )}
                </Button>
                {/* <Button
              variant="outline"
              size="sm"
              onClick={toggleAudio}
              className="bg-gray-800/50 hover:bg-gray-700/50"
            >
              {isAudioOn ? (
                <Mic className="h-5 w-5" />
              ) : (
                <MicOff className="h-5 w-5" />
              )}
            </Button> */}
              </div>
            </div>
            <div className="btn_wrapper">
              {!isInterviewStarted ? (
                <Button onClick={startInterview} id="start-recording" className="bg-blue-600 hover:bg-blue-700">
                  Start Interview
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  onClick={endInterview}
                  id="stop-recording"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <PhoneOff className="h-5 w-5 mr-2" />
                  End Interview
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="chat-panel">
          <div className="panel_head">
            <h3>Transcript</h3>
          </div>
          
          <div className="panel-body" id="received-text-container">
          {isInterviewStarted ? (
                <p>Interviewer:</p>
              ) : (
                ''
              )}
          </div>
        </div>
      </div>
    </div>
  </React.Fragment>
  );
}