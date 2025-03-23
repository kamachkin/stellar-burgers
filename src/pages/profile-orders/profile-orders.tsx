// src/pages/profile-orders.tsx
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '../../utils/types';
import { getCookie } from '../../utils/cookie';
import {
  WS_USER_ORDERS_CONNECT,
  WS_USER_ORDERS_DISCONNECT
} from '../../services/middleware/wsUserOrdersMiddleware';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  // Берём массив orders из userOrders
  const { orders } = useSelector((state) => state.userOrders);

  useEffect(() => {
    // получаем accessToken из кук (убираем 'Bearer ')
    let accessToken = getCookie('accessToken');
    if (accessToken?.startsWith('Bearer ')) {
      accessToken = accessToken.slice(7);
    }

    // Подключаемся
    dispatch({
      type: WS_USER_ORDERS_CONNECT,
      payload: `wss://norma.nomoreparties.space/orders?token=${accessToken}`
    });

    // При размонтировании отключаемся
    return () => {
      dispatch({ type: WS_USER_ORDERS_DISCONNECT });
    };
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
