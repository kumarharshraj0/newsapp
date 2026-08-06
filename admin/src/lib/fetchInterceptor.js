let isRefreshing = false;
let failedQueue = [];

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
          return response;
        }
      } catch (err) {
        processQueue(err);
        return response;
      } finally {
        isRefreshing = false;
      }
    }

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};
