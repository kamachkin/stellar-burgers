import reducer, { createOrderThunk, resetOrder } from './orderSlice';

describe('orderSlice', () => {
  const initialState = {
    orderNumber: null,
    isLoading: false,
    hasError: false,
    errorMessage: null
  };

  it('должен вернуть начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('должен обрабатывать resetOrder', () => {
    const state = {
      orderNumber: 12345,
      isLoading: false,
      hasError: true,
      errorMessage: 'Ошибка'
    };
    expect(reducer(state, resetOrder())).toEqual(initialState);
  });

  // Тесты для асинхронных экшенов
  it('должен обрабатывать статус pending при создании заказа', () => {
    const state = reducer(initialState, { type: createOrderThunk.pending.type });
    expect(state.isLoading).toBe(true);
    expect(state.hasError).toBe(false);
    expect(state.errorMessage).toBe(null);
  });

  it('должен обрабатывать статус fulfilled при успешном создании заказа', () => {
    const orderNumber = 12345;
    const state = reducer(initialState, { 
      type: createOrderThunk.fulfilled.type,
      payload: orderNumber
    });
    expect(state.isLoading).toBe(false);
    expect(state.orderNumber).toBe(orderNumber);
  });

  it('должен обрабатывать статус rejected при ошибке создания заказа', () => {
    const errorMessage = 'Ошибка при создании заказа';
    const state = reducer(initialState, {
      type: createOrderThunk.rejected.type,
      payload: errorMessage
    });
    expect(state.isLoading).toBe(false);
    expect(state.hasError).toBe(true);
    expect(state.errorMessage).toBe(errorMessage);
  });
});