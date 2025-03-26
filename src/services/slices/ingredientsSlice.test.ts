import reducer, { fetchIngredients } from './ingredientsSlice';
  
describe('ingredientsSlice', () => {
  const initialState = {
    items: [],
    isLoading: false,
    hasError: false
  };

  it('должен вернуть начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  // Тесты для asynchronous actions с использованием extraReducers
  it('должен обрабатывать начало запроса ингредиентов', () => {
    const state = reducer(initialState, { type: fetchIngredients.pending.type });
    expect(state.isLoading).toBe(true);
    expect(state.hasError).toBe(false);
  });

  it('должен обрабатывать успешный запрос ингредиентов', () => {
    const ingredients = [
      { _id: '1', name: 'Булка', type: 'bun', price: 100 },
      { _id: '2', name: 'Салат', type: 'main', price: 50 }
    ];
    
    const state = reducer(initialState, { 
      type: fetchIngredients.fulfilled.type, 
      payload: ingredients 
    });
    
    expect(state.items).toEqual(ingredients);
    expect(state.isLoading).toBe(false);
    expect(state.hasError).toBe(false);
  });

  it('должен обрабатывать ошибку запроса ингредиентов', () => {
    const state = reducer(initialState, { type: fetchIngredients.rejected.type });
    
    expect(state.isLoading).toBe(false);
    expect(state.hasError).toBe(true);
  });
});