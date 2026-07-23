const isLocalhost = window.location.hostname === 'localhost';
const API_HOST = isLocalhost ? 'localhost' : window.location.hostname;
const protocol = window.location.protocol;
const API_BASE = `${protocol}//${API_HOST}:5229/api`;
const IMAGE_BASE = `${protocol}//${API_HOST}:5229`;

/**
 * Recursively fix image URLs:
 * - Converts relative "/uploads/..." → absolute using IMAGE_BASE
 * - Replaces "http://localhost:5229" with IMAGE_BASE (in case backend returns absolute localhost URLs)
 */
function fixImageUrls(obj) {
  if (typeof obj === 'string') {
    // Replace absolute localhost URLs
    let fixed = obj.replace(/http:\/\/localhost:5229/g, IMAGE_BASE);
    // If it's still a relative /uploads/ path, make it absolute
    if (fixed.startsWith('/uploads/')) {
      fixed = `${IMAGE_BASE}${fixed}`;
    }
    return fixed;
  }
  if (Array.isArray(obj)) {
    return obj.map(fixImageUrls);
  }
  if (obj !== null && typeof obj === 'object') {
    const newObj = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = fixImageUrls(obj[key]);
    }
    return newObj;
  }
  return obj;
}

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const adminToken = localStorage.getItem('adminToken');
  const headers = { ...options.headers };
  const authToken = token || adminToken;

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'خطای شبکه' }));
    throw new Error(error.message || 'درخواست ناموفق بود');
  }
  if (response.status === 204) return null;

  const data = await response.json();
  return fixImageUrls(data);
}