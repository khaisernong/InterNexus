import { configureStore } from '@reduxjs/toolkit';

/**
 * Redux Store Configuration
 * 
 * Centralized state management using Redux Toolkit.
 * Provides global state access across the entire application.
 * 
 * Redux Toolkit advantages:
 * - Less boilerplate than classic Redux
 * - Built-in Immer for immutable updates
 * - DevTools integration
 * - Thunk middleware included
 * 
 * Alternative state management:
 * - Zustand: Simpler API, smaller bundle, no Provider needed
 * - Recoil: Atomic state, great for complex dependencies
 * - MobX: Observable-based, less explicit
 * - Context API: Built-in React, good for simple state
 * 
 * When to use what:
 * - Redux: Complex app, time-travel debugging, middleware ecosystem
 * - Zustand: Simple apps, minimal boilerplate
 * - Context: Component-scoped state, theme, auth
 * - Recoil: Derived state, async state
 */

// Import slices (add as you create them)
// import authReducer from './slices/authSlice';
// import projectsReducer from './slices/projectsSlice';
// import partnersReducer from './slices/partnersSlice';

const store = configureStore({
  reducer: {
    // Add reducers here
    // auth: authReducer,
    // projects: projectsReducer,
    // partners: partnersReducer,
  },
  
  // Middleware configuration
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore specific action types if needed
        ignoredActions: ['socket/connect'],
        // Ignore paths in state
        ignoredPaths: ['socket.connection'],
      },
    }),

  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;

/**
 * Example slice structure (create in ./slices/):
 * 
 * import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
 * import api from '../services/api';
 * 
 * export const fetchProjects = createAsyncThunk(
 *   'projects/fetchProjects',
 *   async () => {
 *     const response = await api.get('/projects');
 *     return response.data;
 *   }
 * );
 * 
 * const projectsSlice = createSlice({
 *   name: 'projects',
 *   initialState: {
 *     items: [],
 *     loading: false,
 *     error: null,
 *   },
 *   reducers: {
 *     addProject: (state, action) => {
 *       state.items.push(action.payload);
 *     },
 *   },
 *   extraReducers: (builder) => {
 *     builder
 *       .addCase(fetchProjects.pending, (state) => {
 *         state.loading = true;
 *       })
 *       .addCase(fetchProjects.fulfilled, (state, action) => {
 *         state.loading = false;
 *         state.items = action.payload;
 *       })
 *       .addCase(fetchProjects.rejected, (state, action) => {
 *         state.loading = false;
 *         state.error = action.error.message;
 *       });
 *   },
 * });
 * 
 * export const { addProject } = projectsSlice.actions;
 * export default projectsSlice.reducer;
 */
