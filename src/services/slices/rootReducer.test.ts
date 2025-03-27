import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredientsSlice';
import burgerConstructorReducer from './constructorSlice';
import feedReducer from './feedSlice';
import authReducer from './authSlice';
import orderReducer from './orderSlice';
import userOrdersReducer from './userOrdersSlice';

// Создаем rootReducer так же, как в store.ts
const rootReducer = combineReducers({
  auth: authReducer,
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  feed: feedReducer,
  order: orderReducer,
  userOrders: userOrdersReducer
});

describe('rootReducer', () => {
  test('rootReducer с undefined состоянием и UNKNOWN_ACTION возвращает корректное начальное состояние', () => {
    // Вызываем rootReducer с undefined состоянием и неизвестным экшеном
    const action = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(undefined, action);
    
    // Проверяем, что все части состояния инициализированы
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('userOrders');
  });
});