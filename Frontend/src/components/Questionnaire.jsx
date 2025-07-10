import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import QuestionnaireStep from './QuestionnaireStep';
import { useAuth } from '../utils/AuthContext';

const Questionnaire = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { checkAuthStatus } = useAuth();

  const steps = ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"];

  const questions = [
    [
      { id: 'Language_Proficiency', label: 'Language Proficiency', 
        question: 'How would you describe the child\'s spoken language ability?',
        description: 'Consider both vocabulary and clarity of speech',
        options: [
        'Rarely speaks or responds', 'Uses simple words and phrases', 'Communicates clearly for their age', 'Uses advanced vocabulary'] },
      { id: 'Initiates_Conversation', label: 'Initiates Conversation', 
        question: 'How often does the child start conversations without prompting?',
        description: 'Includes verbal attempts to get attention or share thoughts',
        options: [
        'Never', 'Occasionally', 'Frequently'] },
      { id: 'Communication_Skills', label: 'Express Feelings', 
        question: 'How does the child express their feelings or emotions?',
        description: 'Includes verbal attempts to get attention or share thoughts',
        options: [
        'No', 'Sometimes', 'Yes'] }
    ],
    [
      { id: 'Diagnosis', label: 'Diagnosis', 
        question: 'Has the child been diagnosed with any of the following conditions?',
        description: 'Select the primary diagnosis if multiple conditions exist',
        options: [
        'Autism Spectrum Disorder (ASD)', 'ADHD', 'Intellectual Disability (ID)', 'Specific Learning Disorder (SLD)', 'Speech or Language Disorder', 'Global Developmental Delay', 'No formal diagnosis / Not sure'] },
      { id: 'Medical_Conditions', label: 'Medical Conditions Confirmed', 
        question: 'Has the child been diagnosed with any medical conditions?',
        description: 'Consider any known medical conditions or health concerns',
        options: ['Yes', 'No', 'Under Evaluation'] },
      { id: 'Severity', label: 'Severity', 
        question: 'How would you describe the child\'s daily support requirements?',
        description: 'Consider the amount of assistance needed for daily activities',
        options: [
        'Mild - minimal support required', 'Moderate - regular assistance required', 'Severe - continuous supervision needed'] }
    ],
    [
      { id: 'Independence_Level', label: 'Self-Care Independence', 
        question: 'How independent is the child with basic self-care activities?',
        description: 'Includes dressing, feeding, toileting, and hygiene',
        options: ['Yes', 'Partially', 'No'] },
      { id: 'Learning_Speed', label: 'Learning Speed', 
        question: 'How quickly does the child typically learn new skills?',
        description: 'Consider time needed to acquire new abilities or information',
        options: [
        'With significant difficulty', 'With repeated practice', 'With some support', 'Quickly and independently'] },
      { id: 'Learning_Style', label: 'Preferred Learning Style', 
        question: 'What method helps the child learn most effectively?',
        description: 'Observed most successful learning approach',
        options: [
        'Visual (images, videos)', 'Auditory (spoken instructions, music)', 'Kinesthetic (hands-on activities)', 'Not sure yet'] }
    ],
    [
      { id: 'Memory_Retention', label: 'Memory Retention', 
        question: 'How well does the child remember what they learn?',
        description: 'Ability to retain information over time',
        options: [
        'Often forgets and needs to relearn', 'Retains with reminders or review', 'Applies without difficulty'] },
      { id: 'Skill_Application', label: 'Applies Learned Skills', 
        question: 'How often does the child apply learned skills in real-life situations?',
        description: 'Consider how often skills are used in daily activities',
        options: ['No', 'Sometimes', 'Often'] },
      { id: 'Preferred_Activities', label: 'Preferred Activities', 
        question: 'What activities does the child enjoy most?',
        description: 'Select the most engaging type of activity',
        options: [
        'Drawing or coloring', 'Listening to music or singing', 'Playing games or puzzles', 'Watching videos or cartoons', 'Outdoor play / physical games', 'Storytelling or reading books'] }
    ],
    [
      { id: 'Attention_Span', label: 'Attention Span', 
        question: 'How long does the child typically focus on a single activity?',
        description: 'Consider duration of attention span during focused activities',
        options: ['Less than 10 minutes', '10-30 minutes', 'More than 30 minutes'] },
      { id: 'Social_Interaction', label: 'Social Setting', 
        question: 'Where does the child prefer to engage in social interactions?',
        description: 'Consider preferred setting for social interactions',
        options: ['Alone', 'With a parent/guardian', 'In a group setting'] },
      { id: 'Age_Group', label: 'Age Group', 
        question: 'What is the child\'s current age range?',
        description: 'Used for developmentally appropriate recommendations',
        options: ['2-4 years', '5-7 years', '8-10 years', '11-13 years', '14 years or older'] },
      { id: 'Education_Level', label: 'Education Level', 
        question: 'What is the child\'s current educational level?',
        description: 'Consider current educational level or expected educational attainment',
        options: [
        'Not in school yet', 'Preschool / Kindergarten', 'Primary School (1st-5th)', 'Middle School (6th-8th)', 'High School (9th+)'] }
    ]
  ];

  const handleStepSubmit = (stepData) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);
    
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    } else {
      submitToBackend(updatedData);
    }
  };

  const submitToBackend = async (finalData) => {
    setLoading(true);
    setError(null);
    
    try {
      // First get pathway recommendations from AI service
      const apiFormattedData = {
        "Verbal IQ - Spoken Language": finalData.Language_Proficiency,
        "Verbal IQ - Initiates Conversation": finalData.Initiates_Conversation,
        "Verbal IQ - Express Feelings": finalData.Communication_Skills,
        "Neurodevelopmental Disorder - Diagnosis": finalData.Diagnosis,
        "Neurodevelopmental Disorder - Confirmed": finalData.Medical_Conditions,
        "Degree of Disorder - Severity": finalData.Severity,
        "Degree of Disorder - Self-Care": finalData.Independence_Level,
        "Learning Ability - Speed": finalData.Learning_Speed,
        "Learning Ability - Style": finalData.Learning_Style,
        "Grasping Power - Memory": finalData.Memory_Retention,
        "Grasping Power - Application": finalData.Skill_Application,
        "Hobbies - Activities": finalData.Preferred_Activities,
        "Hobbies - Engagement Time": finalData.Attention_Span,
        "Hobbies - Preferred Setting": finalData.Social_Interaction,
        "Age": finalData.Age_Group,
        "Education Level": finalData.Education_Level
      };

      // Try to connect to AI service
      let pathwayRecommendations = [];
      try {
        const aiResponse = await fetch("http://localhost:8000/predict", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apiFormattedData)
        });

        if (!aiResponse.ok) {
          throw new Error('Failed to get pathway recommendations from AI service');
        }
        
        const aiResult = await aiResponse.json();
        pathwayRecommendations = aiResult.recommended_pathways || [];
        
        if (!pathwayRecommendations.length) {
          throw new Error('No pathway recommendations received from AI service');
        }
      } catch (aiError) {
        console.error('AI service error:', aiError);
        setError('Failed to get personalized pathway recommendations. Please try again later.');
        setLoading(false);
        return;
      }

      // Format questions for assessment submission
      const formattedQuestions = Object.entries(finalData).map(([id, answer]) => {
        const category = id.includes('Language') || id.includes('Communication') ? 'Communication' :
                        id.includes('Diagnosis') || id.includes('Medical') ? 'Medical History' :
                        id.includes('Independence') || id.includes('Severity') ? 'Daily Living' :
                        id.includes('Learning') ? 'Learning Ability' :
                        id.includes('Memory') || id.includes('Skill') ? 'Learning Preferences' :
                        id.includes('Preferred') ? 'Interests' :
                        id.includes('Social') ? 'Social Preferences' :
                        'Demographics';

        return {
          questionText: questions.flat().find(q => q.id === id)?.question || id,
          answer: answer,
          category: category
        };
      });

      // Submit assessment to backend
      const token = localStorage.getItem('token');
      const assessmentResponse = await fetch("http://localhost:8080/api/assessment/submit", {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          questions: formattedQuestions,
          pathwayRecommendations: pathwayRecommendations
        })
      });

      if (!assessmentResponse.ok) {
        throw new Error('Failed to submit assessment');
      }

      // Update user data and navigate to results page
      await checkAuthStatus();
      navigate('/assessment-results', { 
        state: { pathwayRecommendations }
      });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label, i) => (
          <Step key={i}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      <QuestionnaireStep
        questions={questions[activeStep]}
        onSubmit={handleStepSubmit}
        onBack={activeStep > 0 ? () => setActiveStep(p => p - 1) : null}
        isLastStep={activeStep === steps.length - 1}
      />
    </Container>
  );
};

export default Questionnaire;
