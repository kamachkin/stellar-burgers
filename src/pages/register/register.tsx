// src/pages/Register.tsx
import { FC, SyntheticEvent, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { registerUser } from '../../services/slices/authSlice';
import { RegisterUI } from '@ui-pages';
import { Navigate } from 'react-router-dom';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerUser({ email, password, name: userName }));
  };

  // Если пользователь теперь "залогинен"
  // — перенаправить на "/"
  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
