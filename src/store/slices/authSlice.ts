// /src/store/slices/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser } from '@/types/user';

interface AuthState { user: IUser | null;}

const initialState: AuthState = { user: null }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser | null>) {
      state.user = action.payload
    },
    clearUser(state) {
      state.user = null
    },
  },

})

export const { setUser, clearUser } = authSlice.actions
export default authSlice.reducer
