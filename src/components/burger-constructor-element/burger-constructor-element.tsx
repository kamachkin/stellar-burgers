import { FC, memo } from 'react';
import { useDispatch } from '../../services/store';
import {
  removeIngredient,
  reorderIngredients
} from '../../services/slices/constructorSlice';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';

/**
 * Компонент, который оживляет каждый ингредиент конструктора бургера.
 * Здесь каждый элемент знает своё место и роль в создании идеального вкуса.
 */
export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    // Берём волшебную палочку для отправки наших действий
    const dispatch = useDispatch();

    /**
     * Перемещает ингредиент вниз.
     * Если элемент уже последний — оставляем его на своём месте, ведь порядок имеет значение.
     */
    const handleMoveDown = () => {
      if (index === totalItems - 1) return;
      dispatch(reorderIngredients({ dragIndex: index, hoverIndex: index + 1 }));
    };

    /**
     * Поднимает ингредиент вверх.
     * Если элемент — первый, то уже нет места для подъёма, и мы оставляем его на вершине.
     */
    const handleMoveUp = () => {
      if (index === 0) return;
      dispatch(reorderIngredients({ dragIndex: index, hoverIndex: index - 1 }));
    };

    /**
     * Удаляет ингредиент из конструкции.
     * Иногда нужно попрощаться, чтобы дать место для новых вкусовых открытий.
     */
    const handleClose = () => {
      dispatch(removeIngredient(ingredient.id));
    };

    // Рендерим UI-компонент, передавая ему всю магию перемещений и удалений
    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
