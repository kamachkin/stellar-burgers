import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '../../utils/types';

// Тип состояния ингредиентов
interface IngredientsState {
  items: TIngredient[];
  isLoading: boolean;
  hasError: boolean;
}

// Начальное состояние
const initialState: IngredientsState = {
  items: [],
  isLoading: false,
  hasError: false
};

// **Thunk для загрузки ингредиентов**
export const fetchIngredients = createAsyncThunk<TIngredient[], void>(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getIngredientsApi();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка загрузки ингредиентов');
    }
  }
);

// **Создаём Slice**
export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  }
});

// Экспортируем reducer
export default ingredientsSlice.reducer;
