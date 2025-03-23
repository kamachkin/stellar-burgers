import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export const fetchUserOrders = createAsyncThunk<TOrder[]>(
  'userOrders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

interface IUserOrdersState {
  wsConnected: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
  error: string | null;
  isLoading: boolean;
}

const initialState: IUserOrdersState = {
  wsConnected: false,
  orders: [],
  total: 0,
  totalToday: 0,
  error: null,
  isLoading: false
};

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {
    wsUserOrdersConnecting: (state) => {
      state.wsConnected = false;
      state.error = null;
    },
    wsUserOrdersOpen: (state) => {
      state.wsConnected = true;
      state.error = null;
    },
    wsUserOrdersClose: (state) => {
      state.wsConnected = false;
    },
    wsUserOrdersError: (state, action) => {
      state.error = action.payload;
      state.wsConnected = false;
    },
    wsUserOrdersMessage: (state, action) => {
      const { orders, total, totalToday } = action.payload;
      state.orders = orders;
      state.total = total;
      state.totalToday = totalToday;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  wsUserOrdersConnecting,
  wsUserOrdersOpen,
  wsUserOrdersClose,
  wsUserOrdersError,
  wsUserOrdersMessage
} = userOrdersSlice.actions;

export default userOrdersSlice.reducer;
