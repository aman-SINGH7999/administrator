// /src/store/store.ts

import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // add more slices here
  },
  // devTools true by default in dev
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
