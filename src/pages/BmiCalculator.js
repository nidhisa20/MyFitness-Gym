import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Stack } from '@mui/material';

const BMICalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');
  const [exercises, setExercises] = useState([]);

  const handleCalculate = () => {
    if (!weight || !height) return;

    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    setBmi(bmiValue);

    let cat = '';
    let exerciseSuggestions = [];

    if (bmiValue < 18.5) {
      cat = 'Underweight';
    } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
      cat = 'Normal weight';
    } else if (bmiValue >= 25 && bmiValue < 29.9) {
      cat = 'Overweight';
      exerciseSuggestions = ['Brisk walking', 'Cycling', 'Swimming', 'Strength training'];
    } else {
      cat = 'Obese';
      exerciseSuggestions = ['Walking', 'Low-impact cardio', 'Yoga', 'Resistance training'];
    }

    setCategory(cat);
    setExercises(exerciseSuggestions);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5, p: 3, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h4" mb={3} textAlign="center">BMI Calculator</Typography>
      <Stack spacing={2}>
        <TextField
          label="Weight (kg)"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <TextField
          label="Height (cm)"
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </Stack>

      {bmi && (
        <Box mt={3}>
          <Typography variant="h6">Your BMI: {bmi}</Typography>
          <Typography variant="h6">Category: {category}</Typography>

          {exercises.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle1">Recommended Exercises:</Typography>
              <ul>
                {exercises.map((ex, idx) => (
                  <li key={idx}>{ex}</li>
                ))}
              </ul>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default BMICalculator;
