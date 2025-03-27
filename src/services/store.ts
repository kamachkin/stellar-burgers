import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import ingredientsReducer from './slices/ingredientsSlice';
import burgerConstructorReducer from './slices/constructorSlice';
import feedReducer from './slices/feedSlice';
import authReducer from './slices/authSlice';

// Импортируем orderSlice
import orderReducer from './slices/orderSlice';

// Шаг 1: Импортируем userOrdersReducer
import userOrdersReducer from './slices/userOrdersSlice';

// Шаг 2: Импортируем middleware
import { wsUserOrdersMiddleware } from './middleware/wsUserOrdersMiddleware';

const rootReducer = combineReducers({
  auth: authReducer,
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  feed: feedReducer,
  order: orderReducer,
  userOrders: userOrdersReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(wsUserOrdersMiddleware)
});

// Типизация
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = () => dispatchHook<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
