import { FC, SyntheticEvent, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { loginUser } from '../../services/slices/authSlice';
import { LoginUI } from '@ui-pages';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Если уже залогинились, редиректим на "/"
  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      })
      .catch((err) => {
        console.error('Login error:', err);
      });
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
