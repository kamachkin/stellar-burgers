import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { TIngredient, TConstructorIngredient } from '../../utils/types';

interface IConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: IConstructorState = {
  bun: null,
  ingredients: []
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    reorderIngredients: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const { dragIndex, hoverIndex } = action.payload;
      const dragged = state.ingredients[dragIndex];
      state.ingredients.splice(dragIndex, 1);
      state.ingredients.splice(hoverIndex, 0, dragged);
    }
  }
});

export const { addBun, addIngredient, removeIngredient, reorderIngredients } =
  burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
