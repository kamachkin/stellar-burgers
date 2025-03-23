import { FC, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { logoutUser } from '../../services/slices/authSlice';
import { useDispatch } from '../../services/store';

/**
 * Компонент меню профиля с функциями навигации и выхода из системы
 */
export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Мемоизируем обработчик выхода для предотвращения ненужных ререндеров
  const handleLogout = useCallback(() => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate('/login', { replace: true });
        // Можно добавить визуальное уведомление об успешном выходе
      })
      .catch((err) => {
        console.error('Ошибка при выходе из системы:', err);
        // Здесь можно добавить показ уведомления об ошибке
      });
  }, [dispatch, navigate]);

  // Используем только пропсы, которые точно существуют в ProfileMenuUIProps
  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
