import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Box, Button } from '@mui/material';

import './App.css';

import ExerciseDetail from './pages/ExerciseDetail';
import Home from './pages/Home';
import BmiCalculator from './pages/BmiCalculator';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DietChatbot from "./components/DietChatbot";

const App = () => {
  return (
    <Box width="400px" sx={{ width: { xl: '1488px' } }} m="auto">
      <Navbar />

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Button href="/bmi" variant="contained" color="primary">
          BMI Calculator
        </Button>
      </Box>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exercise/:id" element={<ExerciseDetail />} />
        <Route path="/bmi" element={<BmiCalculator />} />
      </Routes>

      <DietChatbot />

      <Footer />
    </Box>
  );
};

export default App;
