import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    logo: null,
    favicon: null,
    trendingTags: ["Cricket", "Election2026", "TechSummit", "MetroUpdate", "ClimateChange"],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllSettings = async () => {
      try {
        const res = await axios.get("/api/settings/all", { validateStatus: () => true });
        if (res.status < 300 && res.data.success && res.data.settings) {
          const newSettings = { ...settings };
          res.data.settings.forEach((setting) => {
            newSettings[setting.key] = setting.value;
            if (setting.key === "trending_tags") newSettings.trendingTags = setting.value;
          });
          setSettings(newSettings);
          
          // Inject favicon immediately
          if (newSettings.favicon) {
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
              link = document.createElement("link");
              link.rel = "icon";
              document.head.appendChild(link);
            }
            link.href = newSettings.favicon;
          }
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
