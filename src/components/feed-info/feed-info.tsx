import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { fetchFeed } from '../../services/slices/feedSlice';

/**
 * Функция getOrders — настоящий отборщик лучших заказов.
 * Она отбирает заказы с указанным статусом, выделяет их номера и оставляет только первые 20 шедевров.
 *
 * @param orders - массив всех заказов, каждый со своей историей.
 * @param status - статус, который нас интересует, например, "done" или "pending".
 * @returns список из номеров заказов, отвечающих заданному статусу.
 */
const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

/**
 * Компонент FeedInfo — витрина вашей ленты заказов,
 * где каждая цифра и каждая строка рассказывает о том, как много заказов уже пройдено
 * и сколько еще успехов впереди.
 */
export const FeedInfo: FC = () => {
  const dispatch = useDispatch();

  // Извлекаем данные из feedSlice — здесь оживает вся динамика заказов:
  // orders — сама лента заказов, total — общее число, а totalToday — успехи сегодняшнего дня.
  const { orders, total, totalToday, isLoading, hasError } = useSelector(
    (state) => state.feed
  );

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    if (!orders.length) {
      dispatch(fetchFeed());
    }
  }, [dispatch, orders.length]);

  if (isLoading) {
    return <p className='text text_type_main-large'>Загрузка...</p>;
  }

  if (hasError) {
    return <p className='text text_type_main-large'>Ошибка загрузки ленты</p>;
  }

  // Фильтруем заказы, разделяя готовые на "готовые к подаче" и те, что еще ожидают своего часа.
  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  // Собираем компактный отчет для отображения в ленте — настоящий фид с цифрами,
  // который говорит: "Мы движемся вперед!"
  const feed = { total, totalToday };

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
