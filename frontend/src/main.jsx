import { createRoot } from "react-dom/client"
// Self-hosted fonts — eliminates render-blocking Google Fonts network request
import "@fontsource/inter/400.css"
import "@fontsource/inter/700.css"
import "@fontsource/crimson-pro/700.css"
import "./index.css"
import "./lib/fetchInterceptor"
import "./lib/axiosInterceptor"
import App from "./App.jsx"
import { Provider } from "react-redux"
import { persistor, store } from "./redux/store"
import { PersistGate } from "redux-persist/integration/react"
import { SettingsProvider } from "./contexts/SettingsContext"

createRoot(document.getElementById("root")).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </Provider>
  </PersistGate>
)
