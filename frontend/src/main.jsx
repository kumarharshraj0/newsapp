import { createRoot } from "react-dom/client"
import "./index.css"
import "./lib/fetchInterceptor"
import "./lib/axiosInterceptor"
import App from "./App.jsx"
import { Provider } from "react-redux"
import { persistor, store } from "./redux/store"
import { PersistGate } from "redux-persist/integration/react"
import { SettingsProvider } from "./contexts/SettingsContext"
import { HelmetProvider } from "react-helmet-async"

createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </Provider>
    </PersistGate>
  </HelmetProvider>
)
