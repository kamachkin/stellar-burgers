import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from './services/store';
import { fetchUserProfile } from './services/slices/authSlice';

interface AppInitializerProps {
  children: React.ReactNode;
  onInitializationComplete?: (isAuthenticated: boolean) => void;
  loadingComponent?: React.ReactNode;
  showDebugInfo?: boolean;
}

/**
 * AppInitializer - компонент, отвечающий за инициализацию приложения
 *
 * Восстанавливает сессию пользователя при наличии токенов авторизации
 * Обеспечивает плавный пользовательский опыт при загрузке приложения
 */
const AppInitializer: React.FC<AppInitializerProps> = ({
  children,
  onInitializationComplete,
  loadingComponent = null,
  showDebugInfo = false
}) => {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Перемещаем логику инициализации в useCallback для корректной работы с зависимостями
  const initializeApp = useCallback(async () => {
    try {
      // Проверяем наличие обоих токенов
      const hasRefreshToken = !!localStorage.getItem('refreshToken');
      const hasAccessToken = document.cookie.includes('accessToken');

      if (showDebugInfo) {
        console.log('🔐 Auth tokens status:', {
          refreshToken: hasRefreshToken ? '✅ Present' : '❌ Missing',
          accessToken: hasAccessToken ? '✅ Present' : '❌ Missing'
        });
      }

      // Восстанавливаем профиль только если оба токена существуют
      if (hasRefreshToken && hasAccessToken) {
        const resultAction = await dispatch(fetchUserProfile());
        const success = fetchUserProfile.fulfilled.match(resultAction);
        setIsAuthenticated(success);

        if (showDebugInfo && !success) {
          console.warn('⚠️ Не удалось восстановить профиль пользователя');
        }
      }
    } catch (error) {
      console.error('🛑 Ошибка при инициализации приложения:', error);
    } finally {
      setIsInitializing(false);
      // Явно передаем текущее значение isAuthenticated в коллбэк
      // вместо использования замыкания
      if (onInitializationComplete) {
        const authStatus =
          !!localStorage.getItem('refreshToken') &&
          document.cookie.includes('accessToken');
        onInitializationComplete(authStatus);
      }
    }
  }, [dispatch, showDebugInfo, onInitializationComplete]);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]); // Теперь единственная зависимость - initializeApp

  // Показываем компонент загрузки, пока идет инициализация
  if (isInitializing && loadingComponent) {
    return <>{loadingComponent}</>;
  }

  return <>{children}</>;
};

export default AppInitializer;
