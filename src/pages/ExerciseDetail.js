import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

import Detail from '../components/Detail';
import ExerciseVideos from '../components/ExerciseVideos';
import SimilarExercises from '../components/SimilarExercises';

const ExerciseDetail = () => {
  const { id } = useParams();

  const [exerciseDetail, setExerciseDetail] = useState(null);
  const [exerciseVideos, setExerciseVideos] = useState([]);
  const [targetMuscleExercises, setTargetMuscleExercises] = useState([]);
  const [equipmentExercises, setEquipmentExercises] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchData = async () => {
      try {
        const baseUrl = 'https://exercisedb-api.vercel.app/api/v1';

        // -----------------------
        // FETCH EXERCISE DETAILS
        // -----------------------
        const res = await fetch(`${baseUrl}/exercises/${id}`);
        const json = await res.json();
        const exercise = json.data;

        if (!exercise) throw new Error('Exercise not found');

        setExerciseDetail(exercise);

        // -----------------------
        // TARGET MUSCLE EXERCISES
        // -----------------------
        if (exercise.target) {
          const targetRes = await fetch(
            `${baseUrl}/exercises/target/${exercise.target.toLowerCase()}`
          );
          const targetJson = await targetRes.json();
          setTargetMuscleExercises(targetJson.data || []);
        } else {
          setTargetMuscleExercises([]);
        }

        // -----------------------
        // EQUIPMENT EXERCISES
        // -----------------------
        if (exercise.equipment) {
          const equipRes = await fetch(
            `${baseUrl}/exercises/equipment/${exercise.equipment.toLowerCase()}`
          );
          const equipJson = await equipRes.json();
          setEquipmentExercises(equipJson.data || []);
        } else {
          setEquipmentExercises([]);
        }

        // -----------------------
        // YOUTUBE VIDEOS
        // -----------------------
        const ytRes = await fetch(
          `https://youtube-search-and-download.p.rapidapi.com/search?query=${exercise.name} exercise`,
          {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
              'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com',
            },
          }
        );

        const ytJson = await ytRes.json();
        setExerciseVideos(ytJson?.contents || []);

      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [id]);

  if (error) {
    return (
      <Box mt="100px" textAlign="center">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!exerciseDetail) {
    return <Typography mt="100px">Loading...</Typography>;
  }

  return (
    <Box sx={{ mt: { lg: '96px', xs: '60px' } }}>
      <Detail exerciseDetail={exerciseDetail} />

      <ExerciseVideos
        exerciseVideos={exerciseVideos}
        name={exerciseDetail.name}
      />

      <SimilarExercises
        targetMuscleExercises={targetMuscleExercises}
        equipmentExercises={equipmentExercises}
      />
    </Box>
  );
};

export default ExerciseDetail;
