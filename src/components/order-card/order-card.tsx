import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';

// Лимит отображаемых ингредиентов на карточке — здесь скрытые ингредиенты сохраняют свою загадочность.
const maxIngredients = 6;

/**
 * Компонент OrderCard — не просто карточка заказа, это мини-история,
 * где каждый ингредиент оживает и вносит свою ноту в симфонию вкуса.
 */
export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  // Получаем текущую локацию для корректного контекста навигации
  const location = useLocation();

  // Извлекаем список ингредиентов из глобального Redux-хранилища — ключ к расшифровке заказа.
  const { items: ingredients } = useSelector((state) => state.ingredients);

  /**
   * Вычисляем расширенную информацию о заказе:
   * – Подбираем каждый ингредиент по ID
   * – Вычисляем общую стоимость заказа
   * – Формируем список ингредиентов для показа
   * – Определяем, сколько ингредиентов скрыто за лимитом отображения
   * – Преобразуем дату создания заказа в объект Date
   */
  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null; // Если ингредиенты ещё не загружены, отложим вычисления

    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], ingredientId: string) => {
        const ingredient = ingredients.find((ing) => ing._id === ingredientId);
        if (ingredient) return [...acc, ingredient];
        return acc;
      },
      []
    );

    // Вычисляем общую стоимость, складывая цену каждого найденного ингредиента
    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    // Отбираем первые maxIngredients для отображения в карточке
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    // Если ингредиентов больше лимита, вычисляем их лишнее количество
    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    // Преобразуем дату создания заказа в объект Date для дальнейшей красивой обработки
    const date = new Date(order.createdAt);

    const info = {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };

    console.log('OrderCard useMemo orderInfo:', info);
    return info;
  }, [order, ingredients]);

  // Если информация о заказе не получена — ничего не рендерим, чтобы не нарушить историю
  if (!orderInfo) return null;

  // Передаём всю собранную магию в UI-компонент, который визуально оживляет заказ
  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
