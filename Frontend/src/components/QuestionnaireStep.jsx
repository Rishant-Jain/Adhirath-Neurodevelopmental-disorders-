import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';

const QuestionnaireStep = ({ questions, onSubmit, onBack, isLastStep }) => {
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);

  const handleChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if all questions are answered
    const unansweredQuestions = questions.filter(q => !answers[q.id]);
    if (unansweredQuestions.length > 0) {
      setError('Please answer all questions before proceeding.');
      return;
    }

    onSubmit(answers);
    setAnswers({});
  };

  if (!questions) {
    return <CircularProgress />;
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {questions.map((question, index) => (
        <Paper key={question.id} elevation={2} sx={{ p: 3, mb: 3 }}>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">
              <Typography variant="h6" gutterBottom>
                {question.question}
              </Typography>
              {question.description && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {question.description}
                </Typography>
              )}
            </FormLabel>
            <RadioGroup
              value={answers[question.id] || ''}
              onChange={(e) => handleChange(question.id, e.target.value)}
            >
              {question.options.map((option, optionIndex) => (
                <FormControlLabel
                  key={optionIndex}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>
      ))}

      {error && (
        <Typography color="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        {onBack ? (
          <Button onClick={onBack} variant="outlined">
            Back
          </Button>
        ) : (
          <Box /> // Empty box for spacing
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
        >
          {isLastStep ? 'Submit' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
};

export default QuestionnaireStep; 