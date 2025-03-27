import { FC } from 'react';
import { useSelector } from '../../services/store';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const user = useSelector((state) => state.auth.user);
  const userName = user ? user.name : '';

  return <AppHeaderUI userName={userName} />;
};
