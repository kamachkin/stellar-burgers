import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

interface IFeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  hasError: boolean;
}

// Начальное состояние
const initialState: IFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  hasError: false
};

// Асинхронная Thunk-функция для загрузки ленты заказов
export const fetchFeed = createAsyncThunk(
  'feed/fetchFeed',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFeedsApi();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка загрузки ленты');
    }
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  }
});

export default feedSlice.reducer;
