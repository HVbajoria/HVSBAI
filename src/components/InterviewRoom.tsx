import { useEffect, useRef, useState } from 'react';
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

export function InterviewRoom() {

// funcion to save html as a html file in the same directory
function saveHtml(html: string, fileName: string) {
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
}

async function convertHtmlToPdf(htmlContent: string) {
  html = htmlContent;
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
    if (selectedRole=='Marketing Manager')
      await realtimeStreaming.send(createConfigMessage("Act like an interviewer named Harshavardhan, conducting a job interview for a Marketing manager position at Unstop, focusing on SEO & SEM, market research, people skills, partner management, as well as communication and problem-solving abilities. # Steps 1. **Introduction:** - Introduce yourself as Shambhavi, explaining the purpose of the interview. - Provide a brief overview of the Marketing Manager role at Unstop and its significance. 2. **Experience and Background:** - Inquire about the candidate’s educational background and qualifications. - Ask about any past experiences or internships related to marketing manager roles. - Explore proficiency in the listed skills and ask the candidate to rate themselves on the basis of a score out of 10. 3. **Required Skills:** - Ask three objective based MCQ questions with 4 options along with proper reasoning of why you chose the particular answer and take that into consideration for evaluation also. - Then ask two subjective questions which are real-world based and situations that are applicable in real-life to test the technical, domain specific and industry skills. 4. **Access the soft skills:** Access the soft skills of the candidate. 5. **Role-play** Act like the company who has approached you for their marketing and wants your help. Help the company solve their issue by giving your thought process, what methods you would use to market and strategies. Make sure the whole situation has all the details and you check the industry, soft skills and also finally close the deal. Have emotions in it just like a real senior position leader from the company. 5. **Leadership and Team Management:** - If applicable, discuss any leadership roles or team management experience. - Inquire about management style and any team-leading experiences, if relevant. 6. **Cultural Fit and Company Values:** - Ask questions to gauge alignment with Unstop’s culture and values. - Explore the candidate’s understanding of Unstop’s business model and potential challenges. 7. **Closing:** - Invite any questions the candidate may have about the role or company. - Provide information on the next steps in the hiring process."));
    else if(selectedRole=='Sales Executive')
      await realtimeStreaming.send(createConfigMessage("Act like an interviewer named Shambhavi conducting a job interview for a Sales Executive role at Unstop, focused on assessing skills in revenue generation, client relationships, communication, problem-solving, and alignment with Unstop's culture, using structured segments like introductions, objective and subjective questions, role-play scenarios, and behavioral evaluations to gauge the candidate's fit and abilities."));
    else if (selectedRole=='SDE')
      await realtimeStreaming.send(createConfigMessage("Act as an interviewer named Harshavardhan conducting a job interview for a fresher SDE position at Unstop, focusing on technical skills in Angular, Laravel, and Python, as well as communication and problem-solving abilities.\n\n# Steps\n\n1. **Introduction:**\n   - Introduce yourself as Shambhavi, explaining the purpose of the interview.\n   - Provide a brief overview of the Software Development Engineer (SDE) role at Unstop and its significance.\n\n2. **Experience and Background:**\n   - Inquire about the candidate’s educational background and qualifications.\n   - Ask about any past experiences or internships related to software development roles.\n   - Explore proficiency in Angular, Laravel, and Python and ask the candidate to rate themselves on the basis of score out of 10\n\n3. **Technical Skills:**\n   - Pose 3 objective multiple-choice questions related to software development role. Ensure the questions are designed to assess the candidate's technical knowledge and logical thinking.\nFor each question:After the candidate selects an answer, ask them to explain why they believe their choice is correct.\nIf the candidate does not provide an explanation or provides an incomplete answer, prompt them again to clarify their reasoning by saying, e.g., \"Can you elaborate on why you think this is the correct answer?\"\n   - Present subjective, scenario-based questions reflecting real-world contexts.\n   - Discuss any experience in developing scalable software solutions.\n\n4. **Problem-Solving and Decision-Making:**\n   - Present situational questions that evaluate problem-solving skills.\n   - Ask about challenging experiences in software development and the strategies used for solving them.\n\n5. **Leadership and Team Management:**\n   - If applicable, discuss any leadership roles or team management experience.\n   - Inquire about management style and any team-leading experiences, if relevant.\n\n6. **Cultural Fit and Company Values:**\n   - Ask questions to gauge alignment with Unstop’s culture and values.\n   - Explore the candidate’s understanding of Unstop’s business model and potential challenges.\n\n7. **Closing:**\n   - Invite any questions the candidate may have about the role or company.\n   - Provide information on the next steps in the hiring process.\n\n# Interview Segments\n\n1. **Objective-Type Questions:**\n   - Use multiple-choice questions to assess technical knowledge.\n   - Format: \"Question text? [A] Option 1 [B] Option 2 [C] Option 3 [D] Option 4\"\n   - Ask the candidate to explain their choice of answer and if the candidate doesn’t give the explanation so ask again to give the explanation why the chosen answer is correct. Explain the logic behind the same\n\n2. **Subjective Questions:**\n   - Challenge candidates with theoretical and practical knowledge evaluations through open-ended questions.\n   - Focus on technical terms relevant to the role and real-life scenarios ranging from easy to complex.\n\n3. **Role-Based Scenario Question:**\n   - Present scenarios to evaluate problem-solving, communication, and interpersonal skills.\n\n4. **Behavioral Assessment:**\n   - Understand demeanor, attitude, and performance under pressure through behavioral questions.\n   - Observe the candidate’s composure and confidence during the interview.\n\n# Output Format\n\n- **Objective Questions**: Present each question with answer options as described.\n- **Subjective and Scenario Questions**: Use open-ended questions with context and clear expectations for answers.\n- **Behavioral Questions**: Design prompts for detailed and candid responses.\n\n# Examples\n\n**Objective-Type Example**\n- \"Which of the following is NOT a feature of Angular?\"\n  - [A] Directives\n  - [B] MVC Architecture\n  - [C] Dependency Injection\n  - [D] Middleware Integration\n\n**Subjective Example**\n- \"Explain how you would implement a RESTful API in Laravel for a simple e-commerce platform. Describe your approach from design to execution.\"\n\n**Role-Based Scenario Example**\n- \"Imagine you’re tasked with deploying an urgent software update resolving a critical bug affecting multiple live applications. How would you prioritize tasks and communicate with stakeholders to ensure minimal disruption?\"\n\n**Behavioral Example**\n- \"Describe a time when you felt overwhelmed at work. How did you handle the situation, and what was the outcome?\"\n\n# Notes\n\n- Ensure question types effectively evaluate the required skills.\n- Tailor scenarios to align with Unstop’s business model.\n- Observe candidate reactions to stress-inducing questions to assess emotional resilience and problem-solving under pressure.\n\n\n\""));
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
        "silence_duration_ms": 1000,
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
        audioPlayer.play(pcmData);
        break;

      case "input_audio_buffer.speech_started":
        let textElements = ReceivedTextContainer.children;
        latestInputSpeechBlock = textElements[textElements.length - 1];
        makeNewTextBlock();
        audioPlayer.clear();
        break;
      case "conversation.item.input_audio_transcription.completed":
        const Content=message.transcript;
        latestInputSpeechBlock.innerHTML += " <b>User:</b><br>" + Content + "<br> <b>Interviewer:</b> ";
        const currentTimestamp = new Date();
        const hoursDifference = Math.floor((currentTimestamp.getTime() - startTimeStamp.getTime()) / (1000 * 60 * 60));
        const minutesDifference = Math.floor((currentTimestamp.getTime() - startTimeStamp.getTime()) / (1000 * 60)) % 60;
        const secondsDifference = Math.floor((currentTimestamp.getTime() - startTimeStamp.getTime()) / 1000) % 60;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to today's date at 00:00:00

        const timestamp = new Date(today.getTime() + hoursDifference * 60 * 60 * 1000 + minutesDifference * 60 * 1000 + secondsDifference * 1000);
        // console.log("Timestamp: ", timestamp);

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
            feedbackready = false;
          }
          const currentTimestamp = new Date();
          const hoursDifference = Math.floor((currentTimestamp.getTime() - startTimeStamp.getTime()) / (1000 * 60 * 60));
          const minutesDifference = Math.floor((currentTimestamp.getTime() - startTimeStamp.getTime()) / (1000 * 60)) % 60;
          const secondsDifference = Math.floor((currentTimestamp.getTime() - startTimeStamp.getTime()) / 1000) % 60;
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Set to today's date at 00:00:00

          const timestamp = new Date(today.getTime() + hoursDifference * 60 * 60 * 1000 + minutesDifference * 60 * 1000 + secondsDifference * 1000);
          // console.log("Timestamp: ", timestamp);
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
    if (recordingActive) {
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
  return 0.7;
}

function getVoice(): Voice {
  if (selectedRole == 'SDE')
    return "echo" as Voice;
  else if (selectedRole == 'Marketing Manager')
    return "echo" as Voice;
  else if (selectedRole == 'Sales Executive')
    return "shimmer" as Voice;
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
    startTimeStamp = new Date();
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
      const url = URL.createObjectURL(blob);
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
  };

  const endInterview = async() => {
    feedbackready = true;
    let feedbackPrompt = `Evaluate the Sale's Executive candidate's interview by assessing their technical and soft skills, with a focus on revenue generation, client relationship building, contribution to company growth, communication, and problem-solving abilities.

# Steps

1. **Revenue Generation**: 
   - Assess the candidate's experience and strategies in generating revenue. 
   - Look for specific examples or metrics demonstrating past success.
   - Evaluate their understanding of market trends and consumer behavior.

2. **Client Relationship Building**:
   - Examine the candidate's approach to fostering and maintaining client relationships.
   - Identify any techniques they use to improve client satisfaction and retention.
   - Consider any examples of successful long-term client partnerships.

3. **Contribution to Company Growth**:
   - Review the candidate's history of contributing to company objectives and growth.
   - Assess their ability to align marketing campaigns with company goals.
   - Look for innovation in expanding market reach or product lines.

4. **Communication Skills**: 
   - Evaluate the clarity, conciseness, and persuasiveness of the candidate's communication.
   - Observe their ability to listen and respond effectively during the interview.
   - Consider their proficiency in both written and verbal communication.

5. **Problem-Solving Abilities**:
   - Assess the candidate's approach to identifying and resolving marketing challenges.
   - Evaluate their critical thinking and decision-making skills.
   - Look for examples of past problem-solving situations they've navigated.

# Output Format

Provide a written evaluation in paragraph form, detailing the candidate’s performance in each of the above areas. Include specific examples mentioned during the interview, and conclude with an overall assessment of the candidate's potential fit for the role.

# Example

**Evaluation of Candidate:**

- *Revenue Generation*: The candidate demonstrated a strong track record of increasing revenue by [specific percentage] over [specific time frame] through strategic [specific strategies]. Their experience with [specific tools or methodologies] shows a solid understanding of market trends.

- *Client Relationship Building*: They emphasized the importance of maintaining transparent communications and leveraging CRM tools to enhance client satisfaction, as evidenced by their success in maintaining [specific percentage] client retention rate over [specific time period].

- *Contribution to Company Growth*: The candidate contributed to previous organizations by launching innovative marketing campaigns that led to a [specific percentage] increase in customer base. Their strategic thinking aligns well with growth objectives.

- *Communication Skills*: Throughout the interview, the candidate communicated their ideas clearly and effectively, illustrating strong verbal communication skills.

- *Problem-Solving Abilities*: They provided a detailed example of how they addressed a major marketing challenge when [specific issue], highlighting their ability to quickly pivot and implement effective solutions.

- *Overall Assessment*: Given their strong track record in revenue generation and fostering client relationships, combined with their effective communication and problem-solving abilities, the candidate is a promising fit for the Marketing Manager role.`;

if ( selectedRole == 'Marketing Manager')
  feedbackPrompt = 'Provide a detailed evaluation of the Marketing Manager candidate\'s interview, assessing their technical and soft skills. Focus on SEO & SEM skills, market research abilities, people skills, partner management, communication, and problem-solving abilities. # Steps 1. **SEO & SEM Skills** - Identify the candidate\'s knowledge and experience with SEO and SEM. - Evaluate their ability to effectively implement strategies and measure performance. 2. **Market Research Abilities** - Assess their skills in conducting and analyzing market research. - Consider their ability to interpret data and apply insights to marketing strategies. 3. **People Skills** - Evaluate their interpersonal skills, including teamwork and conflict resolution. - Consider their ability to lead and motivate others. 4. **Partner Management** - Assess their experience and skills in managing partnerships and collaborations. - Evaluate their strategic thinking and negotiation abilities. 5. **Communication Skills** - Evaluate their verbal and written communication skills. - Consider their ability to clearly and persuasively convey ideas. 6. **Problem-Solving Abilities** - Assess their analytical and critical thinking skills. - Consider examples of how they have solved problems in past roles. 7. **Overall Assessment and Recommendation** - Summarize the strengths and weaknesses observed. - Provide a recommendation on whether to proceed with the candidate. # Output Format Provide the feedback in a structured format, with each skill area rated on a scale (e.g., 1 to 5, with 5 being excellent). Include a short summary for each skill, supported by observed examples. Conclude with an overall assessment and recommendation paragraph. ## SEO & SEM Skills - **Rating:** [1-5] - **Feedback:** [Detailed feedback on their SEO & SEM skills] ## Market Research Abilities - **Rating:** [1-5] - **Feedback:** [Detailed feedback on their market research abilities] ## People Skills - **Rating:** [1-5] - **Feedback:** [Detailed feedback on their people skills] ## Partner Management - **Rating:** [1-5] - **Feedback:** [Detailed feedback on their partner management skills] ## Communication Skills - **Rating:** [1-5] - **Feedback:** [Detailed feedback on their communication skills] ## Problem-Solving Abilities - **Rating:** [1-5] - **Feedback:** [Detailed feedback on their problem-solving abilities] ## Overall Assessment and Recommendation - **Summary:** [Overall strengths and weaknesses] - **Recommendation:** [Recommendation on whether to hire the candidate] # Notes - Use real examples from the interview to support each rating. - Be objective and constructive, ensuring feedback is actionable if applicable.';
else if (selectedRole == 'SDE')
  feedbackPrompt = 'Evaluate the interview that you took now for the fresher SDE role at Unstop, focusing on assessing technical and soft skills related to Angular, Laravel, Python, communication, and problem-solving abilities. Provide structured feedback and ratings for each skill, along with an overall assessment and recommendation. # Skills Assessment ### Angular - **Feedback**: [Provide detailed feedback on the candidate\'s understanding and application of Angular, including specific strengths or areas where improvement is needed. Consider their familiarity with Angular components, services, and integration.] - **Rating**: [X/10] ### Laravel - **Feedback**: [Detail the candidate’s knowledge and experience with Laravel, emphasizing proficiency and practical application. Address their experience with MVC frameworks, eloquent ORM, and Laravel features.] - **Rating**: [X/10] ### Python - **Feedback**: [Offer insights into the candidate\'s proficiency in Python, paying attention to their skill level in coding, algorithms, or specific libraries. Mention their ability to solve problems efficiently using Python.] - **Rating**: [X/10] ### Communication - **Feedback**: [Evaluate the candidate’s ability to communicate clearly and effectively, providing examples if applicable. Consider how well they articulate their thoughts and interact within a technical conversation.] - **Rating**: [X/10] ### Problem-Solving - **Feedback**: [Assess the candidate\'s approach to problem-solving, creativity, and critical thinking. Describe their ability to analyze problems and develop effective solutions, providing examples from the interview if possible.] - **Rating**: [X/10] # Overall Feedback - **Summary**: [Write a brief summary of the candidate’s overall performance, highlighting key strengths and identifying areas where they can improve. Consider the balance of technical and soft skills.] - **Overall Rating**: [X/10] # Recommendation - **Consideration for Role**: [State whether the candidate should be considered for the SDE role based on the interview assessment. Include justification for the recommendation, considering the combined skill ratings and overall fit within the team.] # Output Format Provide the feedback report in a structured format as shown above, ensuring clarity and conciseness in each feedback and rating section. Also only generate report if there is enough interaction between the candidate and the interviewer.';

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
               "text":"Could you please share me the detailed feedback and if I am eligible for the role or not. Also analysis on each and every question. Only give the feedback when there is enough interaction with the candidate."
            }
         ]
      }
   });
   realtimeStreaming.send({
    type: "response.create",
  });
  if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
    mediaRecorderRef.current.stop();
  }
  stopMediaStream();
  setTimeout(() => {
    realtimeStreaming.close();
  }, 60000);
    navigate('/interview-history');
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 grid grid-cols-2 gap-4">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover rounded-lg bg-gray-800"
            />
            <div className="absolute bottom-4 left-4 space-x-2">
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
          <div className="relative bg-gray-800 rounded-lg flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
              alt="AI Interviewer"
              className="w-32 h-32 rounded-full"
            />
            <div
              className={`absolute inset-0 rounded-full border-2 border-blue-500 animate-pulse ${
                isInterviewStarted ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </div>

        <div className="p-4 flex justify-center space-x-4">
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

      <div className="w-80 bg-gray-800 p-4 overflow-y-auto" id="received-text-container">
        <h3 className="text-lg font-semibold mb-4">Transcript</h3>
        <div className="space-y-4">
      </div>
      </div>
    </div>
  );
}