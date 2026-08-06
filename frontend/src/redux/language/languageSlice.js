import { createSlice } from "@reduxjs/toolkit"

const languageSlice = createSlice({
  name: "language",
  initialState: {
    selectedLanguage: "all", // "all" | "english" | "hindi"
  },
  reducers: {
    setLanguage: (state, action) => {
      state.selectedLanguage = action.payload
    },
  },
})

export const { setLanguage } = languageSlice.actions
export default languageSlice.reducer
