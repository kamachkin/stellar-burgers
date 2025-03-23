import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate
} from 'react-router-dom';

import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';

// 🚀 Страницы нашего приложения – каждая страница рассказывает свою историю
import { ConstructorPage } from '../../pages/constructor-page';
import { Feed } from '../../pages/feed';
import { Login } from '../../pages/login';
import { Register } from '../../pages/register';
import { ForgotPassword } from '../../pages/forgot-password';
import { ResetPassword } from '../../pages/reset-password';
import { Profile } from '../../pages/profile';
import { ProfileOrders } from '../../pages/profile-orders';
import { NotFound404 } from '../../pages/not-fount-404';

// 🖼️ Модальные окна – краткие, но яркие эпизоды сюжета
import { Modal } from '../modal/modal';
import { OrderInfo } from '../order-info/order-info';
import { IngredientDetails } from '../ingredient-details/ingredient-details';

// 🔒 Защищённые маршруты – доступ только для избранных (и авторизованных) пользователей
import ProtectedRoute from '../ProtectedRoute';

/**
 * Главный компонент приложения.
 * Здесь мы объединяем маршрутизацию, шапку и магию модальных окон в единое целое.
 */
const App = () => (
  <div className={styles.app}>
    <Router>
      <AppHeader />
      {/* Здесь происходит умный роутинг с поддержкой модальных окон */}
      <ModalSwitch />
    </Router>
  </div>
);

/**
 * Компонент для управляемой маршрутизации и модальных окон.
 * Он следит за навигацией и умело накладывает модальные окна поверх основного контента.
 */
const ModalSwitch = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Сохраняем предыдущую локацию для создания эффекта «окна в окне»
  const background = location.state?.background;
  // Флаг для вложенных модалок, когда модальное окно появилось внутри другого
  const nested = location.state?.nested || false;

  // 🎩 Универсальный обработчик закрытия модальных окон:
  // Он всегда знает, как вернуть вас туда, откуда вы пришли.
  const handleCloseModal = () => {
    navigate(-1);
  };

  // 🚪 Специальный обработчик для закрытия заказов из профиля:
  // Возвращает туда, где уже ждут ваши заказы.
  const handleCloseProfileOrderModal = () => {
    navigate('/profile/orders', { replace: true });
  };

  // 🔄 Обработчик для вложенных модальных окон с ингредиентами:
  // Если модальное окно появилось в профиле – возвращаем вас к списку заказов,
  // иначе просто шаг назад.
  const handleCloseNestedIngredientModal = () => {
    if (background && background.pathname.startsWith('/profile/orders')) {
      navigate(background.pathname, { replace: true });
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      {/* 📄 Основные маршруты – тут живут главные страницы приложения */}
      <Routes location={background || location}>
        {/* 🏠 Домашняя страница-конструктор */}
        <Route path='/' element={<ConstructorPage />} />
        {/* 📰 Лента заказов */}
        <Route path='/feed' element={<Feed />} />

        {/* 🔑 Страницы авторизации */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />

        {/* 👤 Личный кабинет – доступен только после авторизации */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        {/* 🔍 Детальные страницы */}
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        {/* 🤷‍♂️ Заглушка на 404 – когда ничего не подходит */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* 🪟 Модальные окна – легкие вспышки интерактивного контента */}
      {background && (
        <Routes>
          {/* ⚡ Модальное окно для просмотра заказа из ленты */}
          <Route
            path='/feed/:number'
            element={
              <Modal title='' onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
          {/* 🍴 Модальное окно для детальной информации об ингредиенте */}
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title=''
                onClose={
                  nested && background.pathname.startsWith('/profile/orders')
                    ? handleCloseNestedIngredientModal
                    : handleCloseModal
                }
                nested={nested}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          {/* 🛡 Модальное окно для просмотра заказа из личного кабинета */}
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='' onClose={handleCloseProfileOrderModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};

export default App;
