import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  TRegisterData,
  loginUserApi,
  TLoginData,
  logoutApi,
  updateUserApi,
  getUserApi
} from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';
import { TUser } from '../../utils/types';

type TAuthState = {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TAuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

/** Thunk: регистрация */
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(formData);
      if (response.success) {
        localStorage.setItem('refreshToken', response.refreshToken);
        setCookie('accessToken', response.accessToken);
        return response.user;
      } else {
        return rejectWithValue('Регистрация не удалась');
      }
    } catch (err: any) {
      return rejectWithValue(
        err.message || 'Ошибка при регистрации пользователя'
      );
    }
  }
);

/** Thunk: логин */
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (formData: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(formData);
      if (response.success) {
        localStorage.setItem('refreshToken', response.refreshToken);
        setCookie('accessToken', response.accessToken);
        return response.user;
      } else {
        return rejectWithValue('Не удалось авторизоваться');
      }
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка при авторизации');
    }
  }
);

/** Thunk: обновление данных пользователя */
export const updateUserThunk = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('auth/updateUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(userData);
    if (response.success) {
      return response.user;
    } else {
      return rejectWithValue('Ошибка при обновлении данных');
    }
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка при обновлении данных');
  }
});

/** Thunk: выход */
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutApi();
      if (response.success) {
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
        return true;
      } else {
        return rejectWithValue('Не удалось выйти');
      }
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка при выходе');
    }
  }
);

/** Thunk: автологин (получение данных пользователя) */
export const fetchUserProfile = createAsyncThunk<
  TUser,
  void,
  { rejectValue: string }
>('auth/fetchUserProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await getUserApi();
    if (response.success) {
      return response.user;
    } else {
      return rejectWithValue('Ошибка получения пользователя');
    }
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка получения пользователя');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Регистрация
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      // Логин
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      // Обновление пользователя
      .addCase(updateUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Автологин (fetchUserProfile)
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      });
  }
});

export default authSlice.reducer;
