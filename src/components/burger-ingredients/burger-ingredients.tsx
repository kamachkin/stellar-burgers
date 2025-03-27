import React, { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';

// Импортируем типы для ингредиентов и режима вкладок
import { TIngredient, TTabMode } from '../../utils/types';

/**
 * Компонент "BurgerIngredients" – сердце вашего приложения,
 * которое оживляет мир ингредиентов. Он отвечает за загрузку, фильтрацию
 * и навигацию по категориям – от свежих булок до изысканных соусов.
 */
export const BurgerIngredients: FC = () => {
  const dispatch = useDispatch();

  // Извлекаем ингредиенты, информацию о загрузке и возможных ошибках из глобального хранилища Redux.
  const { items, isLoading, hasError } = useSelector(
    (state) => state.ingredients
  );

  // При первом рендере инициируем волшебную загрузку ингредиентов, если их ещё нет.
  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, items.length]);

  // Делим ингредиенты на категории: булки – основа, начинки – душа и соусы – изюминка вкуса.
  const buns: TIngredient[] = items.filter((item) => item.type === 'bun');
  const mains: TIngredient[] = items.filter((item) => item.type === 'main');
  const sauces: TIngredient[] = items.filter((item) => item.type === 'sauce');

  // Состояние текущего активного таба – определяет, какая категория находится в центре внимания.
  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  // Рефы для заголовков категорий, чтобы обеспечить плавный переход при клике на вкладку.
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  // Используем Intersection Observer для отслеживания видимости секций с ингредиентами.
  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  // Автоматически обновляем активный таб в зависимости от того, какая секция находится в поле зрения.
  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  /**
   * Обработчик клика по вкладке.
   * Он меняет активный таб и плавно скроллит к соответствующей секции,
   * даруя ощущение живости и динамики.
   */
  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun') {
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    if (tab === 'main') {
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    if (tab === 'sauce') {
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Пока ингредиенты загружаются, позвольте пользователю насладиться предвкушением вкуса.
  if (isLoading) {
    return (
      <p className='text text_type_main-large'>Загрузка ингредиентов...</p>
    );
  }

  // Если произошла ошибка при загрузке, информируем пользователя с теплотой и заботой.
  if (hasError) {
    return <p className='text text_type_main-large'>Ошибка загрузки данных</p>;
  }

  // Передаём все собранные данные и обработчики в UI-компонент,
  // который визуально оживляет раздел ингредиентов.
  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
