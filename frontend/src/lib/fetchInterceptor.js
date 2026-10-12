let isRefreshing = false;
let failedQueue = [];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const originalFetch = window.fetch;

window.fetch = async (...args) => {
  try {
    // If request starts with /api and API_BASE_URL is set, prepend baseURL
    if (API_BASE_URL && typeof args[0] === "string" && args[0].startsWith("/api")) {
      args[0] = `${API_BASE_URL}${args[0]}`;
    }
    const response = await originalFetch(...args);

    if (response.status === 401 && !args[0].includes('/api/auth/refresh-token') && !args[0].includes('/api/auth/signin') && !args[0].includes('/api/auth/google')) {
      const originalRequest = args;

      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return originalFetch(...originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await originalFetch('/api/auth/refresh-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (refreshResponse.ok) {
          processQueue(null);
          return originalFetch(...originalRequest);
        } else {
          processQueue(new Error('Refresh token failed'));
          // Optionally dispatch a logout action or clear storage here
          // e.g., store.dispatch(signOutSuccess());
          return response; // Return the original 401 response
        }
      } catch (err) {
        processQueue(err);
        return response; // Return the original 401 response
      } finally {
        isRefreshing = false;
      }
    }

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};
