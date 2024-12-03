import { Interview, TranscriptMessage } from '../types/interview';

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

export const sampleInterviews: Interview[] = [
  {
    id: '1',
    role: 'SDE',
    skills: ['JavaScript', 'React', 'Node.js'],
    date: new Date('2024-03-15T10:00:00'),
    status: 'completed',
    duration: 10000,
    transcript: [
      createTranscriptMessage(
        'interviewer',
        'Can you explain how React hooks work?',
        new Date('2024-03-15T10:01:00')
      ),
      createTranscriptMessage(
        'candidate',
        'React hooks are functions that allow us to use state and lifecycle features in functional components. useState and useEffect are the most commonly used hooks...',
        new Date('2024-03-15T10:02:00')
      ),
      createTranscriptMessage(
        'interviewer',
        'Could you give an example of useEffect usage?',
        new Date('2024-03-15T10:03:00')
      ),
      createTranscriptMessage(
        'candidate',
        'useEffect is used for side effects in components. For example, fetching data, subscribing to events, or manually changing the DOM...',
        new Date('2024-03-15T10:04:00')
      ),
    ],
    feedback: '<h1><a name="bookmark0">&zwnj;</a>Feedback Report<br><br><span class="s1">Skills Assessment <br><br></span><span class="s2">Angular</span><a name="bookmark1">&zwnj;</a><a name="bookmark2">&zwnj;</a><a name="bookmark3">&zwnj;</a><a name="bookmark4">&zwnj;</a><a name="bookmark5">&zwnj;</a><a name="bookmark6">&zwnj;</a><a name="bookmark7">&zwnj;</a><a name="bookmark8">&zwnj;</a></h1><ul id="l1"><li data-list-text="•"><h4><span style="padding-left: 16pt;">Feedback</span><span class="p">: The provided transcript doesn\'t contain any information related to the candidate\'s Angular skills. Further assessment is required to evaluate their proficiency in this area. Questions specifically targeting Angular concepts, practical experience, and problem-solving using the framework should be included in subsequent interviews.</span></h4></li><li data-list-text="•"><h4><span style="padding-left: 16pt;">Rating</span><span class="p">: 3 / 10</span></h4><p><br/></p><h3>Laravel</h3><p></p></li><li data-list-text="•"><h4><span style="padding-left: 16pt;">Feedback</span><span class="p">: Similar to Angular, the transcript doesn\'t offer any insights into the candidate\'s Laravel skills. Future interview rounds should include questions related to Laravel\'s features, routing, database interactions, and experience building web applications using the framework.</span></h4></li><li data-list-text="•"><h4><span style="padding-left: 16pt;">Rating</span><span class="p">: 4 / 10</span></h4><p><br/></p><h3>Python</h3><p></p></li><li data-list-text="•"><h4><span style="padding-left: 16pt;">Feedback</span><span class="p">: The transcript provides no information about the candidate\'s Python skills. It\'s crucial to assess their proficiency in Python by including coding challenges, questions about data structures and algorithms, and exploring their experience with relevant libraries for the role.</span></h4></li><li data-list-text="•"><h4><span style="padding-left: 16pt;">Rating</span><span class="p">: 6 / 10</span></h4><p><br/></p><h3>Communication</h3><p></p></li><li data-list-text="•"><h4><span style="padding-left: 16pt;">Feedback</span><span class="p">: The candidate\'s communication appears weak based on the limited transcript. Responses like "Umm yes" and "Cool" suggest a lack of preparedness and professionalism. The candidate needs to articulate their thoughts more clearly and comprehensively. They should practice explaining technical concepts and experiences in a structured and engaging manner.</span></h4></li><li data-list-text="•"><h4><span style="padding-left: 16pt;">Rating</span><span class="p">: 3/10</span></h4><p><br/></p><h3>Problem-Solving</h3><p></p></li><li data-list-text="•"><h4><span style="padding-left: 16pt;">Feedback</span><span class="p">: The interviewer presented a SOLID principles question, but the candidate\'s response isn\'t included in the transcript. Therefore, it\'s impossible to assess their problem-solving abilities. Including coding challenges, scenario-based questions, and system design problems in subsequent interviews will help gauge their problem-solving skills.</span></h4></li><li data-list-text="•"><h4><span style="padding-left: 16pt;">Rating</span><span class="p">: 4 / 10</span></h4><p><br/></p><h2>Overall Feedback</h2><p></p></li><li data-list-text="•"><h4><span style="padding-left: 16pt;">Summary</span><span class="p">: Based on the limited information available, the candidate\'s communication skills need significant improvement. The transcript doesn\'t provide any information to assess their technical skills in Angular, Laravel, Python, or problem-solving. Further evaluation is essential.</span></h4></li><li data-list-text="•"><h4><span style="padding-left: 16pt;">Overall Rating</span><span class="p">: 3/10 (based on communication only)</span></h4><p><br/></p><h2>Recommendation</h2><p></p></li><li data-list-text="•"><h4><span style="padding-left: 16pt;">Consideration for Role</span><span class="p">: At this point, I would not recommend the candidate for the SDE role. The lack of demonstrable technical skills and weak communication are significant concerns. However, since the transcript is incomplete, it would be unfair to make a final decision. A follow-up interview focusing on technical skills and providing the candidate with an opportunity to showcase their abilities is highly recommended. This follow-up should include specific questions and coding exercises related to Angular, Laravel, and Python, along with more open-ended questions to assess problem-solving abilities and allow the candidate to elaborate on their experiences more effectively. If the candidate demonstrates significant improvement in these areas in the next round, reconsideration may be warranted.</span></h4></li></ul>',
  },
  {
    id: '2',
    role: 'Marketing Manager',
    skills: ['Digital Marketing', 'SEO', 'Content Strategy'],
    date: new Date('2024-03-14T14:00:00'),
    duration: 83631,
    status: 'completed',
    transcript: [
      createTranscriptMessage(
        'interviewer',
        'What experience do you have with digital marketing campaigns?',
        new Date('2024-03-14T14:01:00')
      ),
      createTranscriptMessage(
        'candidate',
        'I have led several successful digital marketing campaigns, focusing on multi-channel strategies including social media, email marketing, and PPC advertising...',
        new Date('2024-03-14T14:02:00')
      ),
      createTranscriptMessage(
        'interviewer',
        'How do you measure the success of a marketing campaign?',
        new Date('2024-03-14T14:03:00')
      ),
      createTranscriptMessage(
        'candidate',
        'I focus on key metrics such as ROI, conversion rates, customer acquisition cost, and engagement metrics...',
        new Date('2024-03-14T14:04:00')
      ),
    ],
    feedback: 'The candidate demonstrated a strong understanding of React and JavaScript concepts.',
  },
];