import React, { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

// Определяем допустимые значения статуса
type OrderStatusType = 'pending' | 'done' | 'created';

// Конфигурация для каждого статуса
const STATUS_CONFIG: Record<
  OrderStatusType,
  {
    text: string;
    color: string;
    icon: string;
  }
> = {
  pending: {
    text: 'Готовится',
    color: '#E52B1A', // красный
    icon: '🔄'
  },
  done: {
    text: 'Выполнен',
    color: '#00CCCC', // голубой
    icon: '✅'
  },
  created: {
    text: 'Создан',
    color: '#F2F2F3', // светло-серый
    icon: '🆕'
  }
};

/**
 * Компонент для отображения статуса заказа
 * с соответствующим цветом и иконкой
 */
export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  // Проверяем, является ли status ключом STATUS_CONFIG
  const isValidStatus = (s: string): s is OrderStatusType =>
    Object.keys(STATUS_CONFIG).includes(s);

  // Получаем конфигурацию для статуса или используем конфигурацию для 'created' по умолчанию
  const config = isValidStatus(status)
    ? STATUS_CONFIG[status]
    : STATUS_CONFIG.created;

  // Передаем цвет и текст в UI компонент
  return (
    <OrderStatusUI
      textStyle={config.color}
      text={`${config.icon} ${config.text}`}
    />
  );
};
