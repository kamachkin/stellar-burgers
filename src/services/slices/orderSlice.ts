import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';

interface IOrderState {
  orderNumber: number | null;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

const initialState: IOrderState = {
  orderNumber: null,
  isLoading: false,
  hasError: false,
  errorMessage: null
};

export const createOrderThunk = createAsyncThunk<
  number,
  string[],
  { rejectValue: string }
>('order/createOrder', async (ingredientsIds, { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(ingredientsIds);
    return response.order.number;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка при создании заказа');
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.orderNumber = null;
      state.isLoading = false;
      state.hasError = false;
      state.errorMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderNumber = action.payload;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.errorMessage = action.payload as string;
      });
  }
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;
