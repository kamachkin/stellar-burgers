import React, { FC, useMemo } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import { createOrderThunk, resetOrder } from '../../services/slices/orderSlice';
import { TIngredient, TOrder } from '../../utils/types';

export const BurgerConstructor: FC = () => {
  // Захватываем инструменты для отправки действий и навигации – это наш секретный набор.
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Из хранилища достаём ингредиенты для бургера – каждый кусочек имеет значение.
  const { bun, ingredients } = useSelector((state) => state.burgerConstructor);
  // Узнаём, авторизован ли наш пользователь – доступ только для тех, кто в деле!
  const { isAuthenticated } = useSelector((state) => state.auth);
  // Информация по заказу: номер заказа и статус загрузки (магия идет полным ходом)
  const { orderNumber, isLoading } = useSelector((state) => state.order);

  // Расчёт общей стоимости – булка дважды для полноты вкуса и каждый ингредиент, что делает бургер особенным.
  const price = useMemo(() => {
    let total = 0;
    if (bun) total += bun.price * 2; // верх и низ булки – ключ к гармонии!
    total += ingredients.reduce(
      (acc: number, item: TIngredient) => acc + item.price,
      0
    );
    return total;
  }, [bun, ingredients]);

  // Подготавливаем данные для модального окна заказа.
  // Даже если сейчас детали пустые, номер заказа говорит: "Всё готово для чуда!"
  const orderModalData: TOrder | null = orderNumber
    ? {
        _id: '',
        status: '',
        name: '',
        createdAt: '',
        updatedAt: '',
        ingredients: [],
        number: orderNumber
      }
    : null;

  // Обработчик клика на кнопку заказа.
  // Если булка отсутствует, бургер не соберется – проверка необходима!
  const onOrderClick = () => {
    if (!bun) return;
    // Если юзер не авторизован, перенаправляем к логину – доверие строится через вход.
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Формируем список ID ингредиентов.
    // Важно: булка добавляется дважды – сверху и снизу для идеального соединения.
    const ingredientsIds = [bun._id, ...ingredients.map((i) => i._id), bun._id];
    dispatch(createOrderThunk(ingredientsIds));
  };

  // Обработчик закрытия модального окна заказа.
  // Сбрасываем состояние заказа, чтобы стол для нового кулинарного шедевра был чист.
  const closeOrderModal = () => {
    dispatch(resetOrder());
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={isLoading}
      // Передаём ингредиенты, ведь каждый компонент – часть вкусной композиции.
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
