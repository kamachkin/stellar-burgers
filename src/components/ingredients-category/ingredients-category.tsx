import { forwardRef, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { RootState } from '../../services/store';

/**
 * Компонент IngredientsCategory — это маленький рассказ о том, как ингредиенты
 * объединяются в единое целое на вашем экране. Здесь мы получаем данные конструктора
 * и превращаем их в детальную статистику, которая делает ваше приложение живым.
 */
export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  // Вытаскиваем магию конструктора бургера из глобального Redux-хранилища.
  const burgerConstructor = useSelector(
    (state: RootState) => state.burgerConstructor
  );

  /**
   * Вычисляем счетчики для каждого ингредиента.
   * Этот блок превращает сухие цифры в живую статистику: сколько раз
   * каждый ингредиент уже добавлен в ваш кулинарный шедевр.
   */
  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients: constructorIngredients } = burgerConstructor;
    const counters: { [key: string]: number } = {};

    // Проходим по каждому ингредиенту конструктора и считаем его появления.
    constructorIngredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) {
        counters[ingredient._id] = 0;
      }
      counters[ingredient._id]++;
    });
    // Булка особенная – она должна появиться ровно один раз, чтобы сохранить гармонию вкуса.
    if (bun && bun._id) {
      counters[bun._id] = 1;
    }
    return counters;
  }, [burgerConstructor]);

  // Передаем всю собранную магию в UI-компонент, который визуально оживляет категорию ингредиентов.
  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
