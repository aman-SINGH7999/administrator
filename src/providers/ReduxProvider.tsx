// /src/providers/ReduxProvider.tsx

'use client'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import React, { useEffect } from 'react'
import { setUser } from "@/store/slices/authSlice";

export default function ReduxProvider({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      store.dispatch(setUser(JSON.parse(storedUser)));
    }
  }, []);

  return <Provider store={store}>{children}</Provider>
}
