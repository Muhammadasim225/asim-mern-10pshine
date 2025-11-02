import { configureStore } from '@reduxjs/toolkit';
import createNoteReducer from '../features/notesSlice'
import signupReducer from '../features/authSlice';
export const store = configureStore({
  reducer: {
    createNote:createNoteReducer,
    createAccount:signupReducer
  },

})