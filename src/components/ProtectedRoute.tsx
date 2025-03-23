import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../services/store';
import { RootState, useDispatch } from '../services/store';
import { fetchUserProfile } from '../services/slices/authSlice';
import { Preloader } from '@ui';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const { isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const hasTokens = Boolean(
    localStorage.getItem('refreshToken') &&
      document.cookie.includes('accessToken')
  );

  // Локальное состояние, чтобы дождаться попытки автологина
  const [autologinAttempted, setAutologinAttempted] = useState(false);

  useEffect(() => {
    // Если есть токены, но пользователь ещё не авторизован и не идёт загрузка,
    // пробуем подтянуть профиль
    if (hasTokens && !isAuthenticated && !isLoading) {
      dispatch(fetchUserProfile())
        .unwrap()
        .catch((error) => {
          console.error('Ошибка автологина:', error);
        })
        .finally(() => {
          setAutologinAttempted(true);
        });
    } else {
      // Если токены отсутствуют или уже авторизованы (или загрузка идёт), считаем, что автологин попытался
      setAutologinAttempted(true);
    }
  }, [hasTokens, isAuthenticated, isLoading, dispatch]);

  // Пока не попытались автологин или идет загрузка – показываем прелоадер
  if (!autologinAttempted || isLoading) {
    return <Preloader />;
  }

  // Если пользователь авторизован, показываем защищённое содержимое, иначе редирект на логин
  return isAuthenticated ? (
    children
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
