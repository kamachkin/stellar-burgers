import React, { FC, useEffect, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { fetchFeed } from '../../services/slices/feedSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { fetchUserOrders } from '../../services/slices/userOrdersSlice';
import { TOrder, TIngredient } from '@utils-types';
import styles from './order-info.module.css';

/**
 * Компонент OrderInfo — это подробный рассказ о заказе,
 * где каждый ингредиент становится персонажем, а итоговая сумма
 * отражает всю магию вкусовых сочетаний.
 *
 * Встретив этот компонент, пользователь получает возможность увидеть
 * детали заказа: от списка использованных ингредиентов до общей стоимости.
 *
 * Обратите внимание: независимо от того, вызывается ли страница в виде модального окна
 * или полноэкранной истории, здесь раскрывается суть каждого заказа.
 */
export const OrderInfo: FC = () => {
  // Извлекаем номер заказа из URL — ключ к поиску нужной истории.
  const { number } = useParams<{ number: string }>();
  // Определяем, в каком режиме мы сейчас — модальное окно или полноценная страница.
  const location = useLocation();
  // Диспетчер для отправки наших волшебных экшенов в Redux.
  const dispatch = useDispatch();

  // Проверяем, открыто ли как модалка (для плавного перехода по приложению)
  const isModal = !!location.state?.background;
  // Определяем, пришёл ли заказ из личного кабинета пользователя.
  const isProfile = location.pathname.startsWith('/profile/orders');

  // --------------------- Извлечение данных из Store ---------------------

  // Данные заказов пользователя
  const userOrders = useSelector((state) => state.userOrders.orders);
  const userOrdersLoading = useSelector((state) => state.userOrders.isLoading);

  // Заказы публичной ленты
  const feedOrders = useSelector((state) => state.feed.orders);
  const feedLoading = useSelector((state) => state.feed.isLoading);

  // Обилие ингредиентов, необходимых для творчества на вашей кухне.
  const ingredients = useSelector((state) => state.ingredients.items);
  const ingredientsLoading = useSelector(
    (state) => state.ingredients.isLoading
  );

  // Выбираем, с каким набором заказов будем работать, в зависимости от контекста.
  const orders = isProfile ? userOrders : feedOrders;
  const ordersLoading = isProfile ? userOrdersLoading : feedLoading;

  // --------------------- ЗАГРУЗКА ДАННЫХ ---------------------

  // Если ингредиенты ещё не загружены, запускаем магию запроса.
  useEffect(() => {
    if (ingredients.length === 0 && !ingredientsLoading) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length, ingredientsLoading]);

  // Если заказов в публичной ленте ещё нет - зовём на помощь волшебство ленты.
  useEffect(() => {
    if (!isProfile && orders.length === 0 && !ordersLoading) {
      dispatch(fetchFeed());
    }
  }, [dispatch, isProfile, orders.length, ordersLoading]);

  // Если мы в личном кабинете и заказы ещё не загружены, то вызываем флот заказов пользователя.
  useEffect(() => {
    if (isProfile && orders.length === 0 && !ordersLoading) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, isProfile, orders.length, ordersLoading]);

  // --------------------- НАХОДИМ ЗАКАЗ ---------------------

  // Ищем нужный заказ по номеру — каждая история уникальна!
  const orderData = orders.find(
    (order: TOrder) => order.number === Number(number)
  );

  // --------------------- СОБИРАЕМ ДЕТАЛИ ЗАКАЗА ---------------------

  /**
   * Превращаем сырой заказ в детальную историю:
   *    • Собираем ингредиенты по их ID.
   *    • Подсчитываем, сколько раз каждый ингредиент был добавлен.
   *    • Вычисляем общую стоимость заказа, отражающую все нюансы.
   *    • Преобразуем дату создания заказа для дальнейшей магии отображения.
   */
  const orderInfo = useMemo(() => {
    if (!orderData || ingredients.length === 0) {
      return null;
    }

    // Создаем "карточку" ингредиентов, где хранится и сам ингредиент, и количество его появлений.
    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        const found = ingredients.find((ing) => ing._id === item);
        if (found) {
          if (!acc[item]) {
            acc[item] = { ...found, count: 1 };
          } else {
            acc[item].count++;
          }
        }
        return acc;
      },
      {}
    );

    // Общая стоимость заказа — сумма цен всех ингредиентов с учетом их количества.
    const total = Object.values(ingredientsInfo).reduce(
      (acc, ing) => acc + ing.price * ing.count,
      0
    );

    // Преобразуем дату создания заказа в объект Date для красоты и удобства.
    const date = new Date(orderData.createdAt);

    return {
      ...orderData,
      ingredientsInfo,
      total,
      date
    };
  }, [orderData, ingredients]);

  // --------------------- ОТРИСОВКА ---------------------

  // Если данные еще загружаются или нужный заказ не найден, показываем прелоадер для терпеливых.
  if (ordersLoading || ingredientsLoading || !orderInfo) {
    return <Preloader />;
  }

  // Выбираем режим отображения: модальное окно или полноэкранная страница.
  if (isModal) {
    return <OrderInfoUI orderInfo={orderInfo} />;
  } else {
    // Полноэкранная история заказов: добавляем заголовок для большего эффекта.
    return (
      <div className={styles.pageContainer}>
        <h2 className='text text_type_main-large pb-5'>Детали заказа</h2>
        <OrderInfoUI orderInfo={orderInfo} />
      </div>
    );
  }
};
