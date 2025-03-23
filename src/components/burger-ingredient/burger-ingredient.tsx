import React, { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { addBun, addIngredient } from '../../services/slices/constructorSlice';
import { TBurgerIngredientProps } from './type';
import { BurgerIngredientUI } from '../ui/burger-ingredient';
import { TIngredient } from '../../utils/types';

/**
 * Компонент, превращающий данные ингредиента в интерактивное кулинарное искусство.
 *
 * Каждый ингредиент здесь — это герой, который может стать основной звездой вашего
 * бургера или же приятно дополнить композицию. Он не просто отображается на экране,
 * он запоминает, сколько раз уже стал частью вашего творения, и открыт для новых
 * приключений, когда вы решаете добавить его снова.
 */
export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient }) => {
    // Получаем текущую локацию, чтобы сохранить контекст навигации.
    const location = useLocation();

    // Диспетчер – наш проводник, который отправляет волшебные команды в сердце приложения.
    const dispatch = useDispatch();

    // Извлекаем состояние конструктора: булка и прочие ингредиенты, уже выбранные для бургера.
    const { bun, ingredients } = useSelector(
      (state) => state.burgerConstructor
    );

    // Считаем, сколько раз выбран данный ингредиент – каждый раз, когда он добавляется,
    // он приближает вас к идеальному вкусу.
    const countInConstructor = ingredients.filter(
      (item) => item._id === ingredient._id
    ).length;

    // Если ингредиент — булка и она уже добавлена, засчитываем единичное появление.
    const countBun = bun && bun._id === ingredient._id ? 1 : 0;
    // Общий счет – сумма обычных ингредиентов и булочной магии.
    const count = countInConstructor + countBun;

    /**
     * Обработчик клика, который добавляет ингредиент в бургер.
     * Если это булка — она заменяет предыдущую, если нет — просто добавляется,
     * обогащая вкусовую композицию.
     */
    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        dispatch(addBun(ingredient));
      } else {
        dispatch(addIngredient(ingredient));
      }
    };

    // Рендерим UI-компонент, передавая всю магию подсчета и обработчики для добавления.
    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
