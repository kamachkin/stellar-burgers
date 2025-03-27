// src/pages/profile.tsx
import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { ProfileUI } from '@ui-pages';
import { updateUserThunk } from '../../services/slices/authSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  // Берем данные пользователя из auth
  const { user } = useSelector((state) => state.auth);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  // Обновляем форму, если данные пользователя изменились
  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (isFormChanged) {
      dispatch(
        updateUserThunk({
          name: formValue.name,
          email: formValue.email,
          password: formValue.password
        })
      );
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
