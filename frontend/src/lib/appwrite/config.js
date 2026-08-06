import { Client, Storage } from "appwrite"

export const appwriteConfig = {
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
  url: import.meta.env.VITE_APPWRITE_URL,
}

export const client = new Client()

if (appwriteConfig.url) {
  client.setEndpoint(appwriteConfig.url)
}
if (appwriteConfig.projectId) {
  client.setProject(appwriteConfig.projectId)
}

export const storage = new Storage(client)
