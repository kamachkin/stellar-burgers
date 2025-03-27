import { FC, memo, useMemo } from 'react';
import { OrdersListProps } from './type';
import { OrdersListUI } from '@ui';

/**
 * Компонент для отображения списка заказов с сортировкой по дате
 * @param {OrdersListProps} props - Свойства компонента
 * @returns {JSX.Element} Отрендеренный UI компонент списка заказов
 */
export const OrdersList: FC<OrdersListProps> = memo(({ orders }) => {
  // Используем useMemo для кэширования отсортированного списка
  // чтобы избежать лишних пересортировок при повторных рендерах
  const sortedOrders = useMemo(() => {
    if (!orders?.length) return [];

    return [...orders].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // От новых к старым
    });
  }, [orders]);

  // Группировка заказов по дате для более наглядного отображения
  // Используем Record<string, any[]> для типизации объекта
  const groupedByDate = useMemo(() => {
    const grouped: Record<string, typeof orders> = {};

    sortedOrders.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString('ru-RU');

      if (!grouped[date]) {
        grouped[date] = [];
      }

      grouped[date].push(order);
    });

    return grouped;
  }, [sortedOrders]);

  // Только для разработки - не будет включено в production сборку
  if (process.env.NODE_ENV === 'development') {
    console.log('OrdersList: отсортированные заказы:', sortedOrders);
    console.log('OrdersList: сгруппированные заказы:', groupedByDate);
  }

  // Убираем проп groupedOrders, так как он не существует в OrdersListUIProps
  return <OrdersListUI orderByDate={sortedOrders} />;
});

// Для лучшей отладки в React DevTools
OrdersList.displayName = 'OrdersList';
