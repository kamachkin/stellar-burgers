import reducer, { addBun, addIngredient, removeIngredient } from './constructorSlice';

describe('Редьюсер конструктора бургера', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  it('должен вернуть начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('должен обрабатывать добавление булки', () => {
    const bun = { 
      _id: '1', 
      name: 'Булка', 
      type: 'bun', 
      price: 100,
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      image: 'url-to-image',
      image_large: 'url-to-large-image',
      image_mobile: 'url-to-mobile-image'
    };
    const action = addBun(bun);
    const newState = reducer(initialState, action);
    expect(newState.bun).toEqual(bun);
  });

  it('должен обрабатывать добавление ингредиента', () => {
    const ingredient = { 
      _id: '2', 
      name: 'Салат', 
      type: 'main', 
      price: 50,
      proteins: 5,
      fat: 2,
      carbohydrates: 8,
      calories: 50,
      image: 'url-to-image',
      image_large: 'url-to-large-image',
      image_mobile: 'url-to-mobile-image'
    };
    const action = addIngredient(ingredient);
    const newState = reducer(initialState, action);
    
    expect(newState.ingredients.length).toBe(1);
    expect(newState.ingredients[0].name).toBe('Салат');
    // У ингредиента должен быть уникальный id
    expect(newState.ingredients[0].id).toBeTruthy();
  });

  it('должен обрабатывать удаление ингредиента', () => {
    // Сначала добавляем ингредиент
    const ingredient = { 
      _id: '2', 
      name: 'Салат', 
      type: 'main', 
      price: 50,
      proteins: 5,
      fat: 2,
      carbohydrates: 8,
      calories: 50,
      image: 'url-to-image',
      image_large: 'url-to-large-image',
      image_mobile: 'url-to-mobile-image'
    };
    const addAction = addIngredient(ingredient);
    const stateWithIngredient = reducer(initialState, addAction);
    
    // Теперь удаляем его по id
    const ingredientId = stateWithIngredient.ingredients[0].id;
    const removeAction = removeIngredient(ingredientId);
    const finalState = reducer(stateWithIngredient, removeAction);
    
    expect(finalState.ingredients.length).toBe(0);
  });
});