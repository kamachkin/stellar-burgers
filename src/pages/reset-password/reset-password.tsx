// src/pages/reset-password.tsx
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<Error | null>(null);

  // Если пользователь не открыл эту страницу через /forgot-password,
  // перенаправим обратно на /forgot-password
  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null); // сбрасываем предыдущую ошибку

    resetPasswordApi({ password, token })
      .then(() => {
        // Удаляем флаг resetPassword, чтобы нельзя было заново вернуться
        localStorage.removeItem('resetPassword');
        // По чек-листу: «перенаправить на страницу входа»
        navigate('/login', { replace: true });
      })
      .catch((err: Error) => {
        // Сохраняем ошибку, отобразим её через errorText
        setError(err);
      });
  };

  return (
    <ResetPasswordUI
      errorText={error?.message}
      password={password}
      setPassword={setPassword}
      token={token}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
