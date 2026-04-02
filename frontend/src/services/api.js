import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Attach token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// ============ AUTH ============
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');
export const register = (data) => api.post('/auth/register', data);

// ============ LISTINGS ============
export const getListings = (params) => api.get('/listings', { params });
export const getFeaturedListings = () => api.get('/listings/featured');
export const getListingFilters = () => api.get('/listings/filters');
export const getListing = (slug) => api.get(`/listings/${slug}`);
export const getAllListings = () => api.get('/listings/all');
export const createListing = (data) => api.post('/listings', data);
export const updateListing = (id, data) => api.put(`/listings/${id}`, data);
export const deleteListing = (id) => api.delete(`/listings/${id}`);
export const uploadListingImages = (id, formData) =>
  api.post(`/listings/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
export const deleteListingImage = (listingId, imageId) =>
  api.delete(`/listings/${listingId}/images/${imageId}`);

// ============ PAGES ============
export const getPage = (slug) => api.get(`/pages/${slug}`);
export const getPages = () => api.get('/pages');
export const updatePage = (slug, data) => api.put(`/pages/${slug}`, data);

// ============ CONTACT ============
export const getContact = () => api.get('/contact');
export const updateContact = (data) => api.put('/contact', data);

// ============ BLOG ============
export const getBlogs = (params) => api.get('/blog', { params });
export const getBlog = (slug) => api.get(`/blog/${slug}`);
export const getAllBlogs = () => api.get('/blog/all');
export const createBlog = (formData) =>
  api.post('/blog', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateBlog = (id, formData) =>
  api.put(`/blog/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteBlog = (id) => api.delete(`/blog/${id}`);

// ============ SETTINGS ============
export const getSettings = () => api.get('/settings');
export const updateSettings = (data) => api.put('/settings', data);
export const uploadLogo = (formData) =>
  api.post('/settings/logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export default api;
