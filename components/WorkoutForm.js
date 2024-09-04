import React, { useState } from "react";
import styled from "styled-components";
import { exercises } from "@/lib/exercises";
import findExerciseById from "@/utils/findExerciseById";

// Styled Components
const Header = styled.header`
  text-align: center;
  margin-bottom: 1rem;
`;

const WrapperFilter = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  z-index: 1;
  background: rgba(0, 0, 0, 0.6);
  padding: 1rem 3rem;
`;

const WrapperForm = styled.div`
  display: flex;
  justify-content: center;
  background-color: white;
  border-radius: 10px;
  padding: 1rem;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 1rem;
  margin: 0 auto;
`;

const Fieldset = styled.fieldset`
  border: none;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Legend = styled.legend`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 1rem;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const Button = styled.button`
  background-color: #3498db;
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;

const ButtonSecondary = styled(Button)`
  background-color: #27ae60;
  border: 1px solid #fff;

  &:hover {
    background-color: #1f8a4d;
  }
`;

const CancelButton = styled(ButtonSecondary)`
  background-color: #dc3545;
  border: 1px solid #fff;

  &:hover {
    background-color: #c82333;
  }
`;

const ExerciseListContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ExerciseItem = styled.li`
  background-color: #f4f4f4;
  border-radius: 4px;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
`;

const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

const InlineContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  width: 100%;
`;

const RepsSetsLabel = styled.label`
  flex: 1;
  display: flex;
  flex-direction: column;
  font-weight: bold;
`;

const ExerciseListDisplay = styled.div`
  margin-top: 1rem;
`;

export default function Form({ onAddWorkout, handleCancel, onCreateMode }) {
  const [currentExercises, setCurrentExercises] = useState([]);

  function handleAddExercise(event) {
    const form = event.target.form;
    const exerciseId = form.elements.exerciseName.value;
    const sets = form.elements.sets.value;
    const reps = form.elements.reps.value;

    if (exerciseId === "default" || sets <= 0 || reps <= 0) {
      alert("Please fill in all the fields.");
      form.elements.exerciseName.focus();
    } else {
      setCurrentExercises([
        ...currentExercises,
        { exerciseId: exerciseId, sets: sets, reps: reps },
      ]);
      form.elements.exerciseName.value = "";
      form.elements.sets.value = "";
      form.elements.reps.value = "";
      form.elements.exerciseName.focus();
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    const name = data.workoutName;
    if (!currentExercises.length) {
      alert("Please add exercises to your workout!");
    } else {
      onAddWorkout(name, currentExercises);
      onCreateMode();
      setCurrentExercises([]);
      event.target.reset();
    }
  }

  return (
    <WrapperFilter>
      <WrapperForm>
        <FormContainer>
          <Header>
            <h2>Create New Workout</h2>
          </Header>
          <form onSubmit={handleSubmit}>
            <Label>
              Workout Name
              <Input
                type="text"
                name="workoutName"
                placeholder="your workout name"
                required
                maxLength={30}
              />
            </Label>

            <Fieldset>
              <Legend>New Exercise</Legend>
              <Label>
                Exercise Name
                <Select name="exerciseName" defaultValue="default">
                  <option value="default" disabled>
                    Please select an exercise
                  </option>
                  {exercises.map((exercise) => (
                    <option key={exercise.id} value={exercise.id}>
                      {exercise.name}
                    </option>
                  ))}
                </Select>
              </Label>
              <InlineContainer>
                <RepsSetsLabel>
                  Sets
                  <Input
                    type="number"
                    name="sets"
                    min="1"
                    max="50"
                    placeholder="min. 1"
                  />
                </RepsSetsLabel>
                <RepsSetsLabel>
                  Reps
                  <Input
                    type="number"
                    name="reps"
                    min="1"
                    max="100"
                    placeholder="min. 1"
                  />
                </RepsSetsLabel>
              </InlineContainer>
              <Button type="button" onClick={handleAddExercise}>
                + Add Exercise
              </Button>
            </Fieldset>

            {/* Display the list of added exercises */}
            <ExerciseListDisplay>
              <h3>Exercises</h3>
              <ExerciseListContainer>
                {currentExercises.map((exercise, index) => (
                  <ExerciseItem key={index}>
                    <strong>
                      {findExerciseById(exercises, exercise.exerciseId).name}
                    </strong>{" "}
                    - {exercise.sets} sets, {exercise.reps} reps
                  </ExerciseItem>
                ))}
              </ExerciseListContainer>
            </ExerciseListDisplay>

            <StyledDiv>
              <CancelButton type="button" onClick={handleCancel}>
                Cancel
              </CancelButton>
              <ButtonSecondary type="submit">Save Workout</ButtonSecondary>
            </StyledDiv>
          </form>
        </FormContainer>
      </WrapperForm>
    </WrapperFilter>
  );
}
