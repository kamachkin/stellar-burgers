// src/components/ingredient-details/ingredient-details.tsx

import React, { FC, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

import { useSelector, useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import styles from './ingredient-details.module.css';

/**
 * Компонент IngredientDetails — это окно, в котором каждый ингредиент
 * раскрывается с новой стороны. Он загружает данные и решает, как именно
 * показать их: как модальное окно с тонкой надписью или как полноценную страницу,
 * где каждая деталь заслуживает своего заголовка.
 */
export const IngredientDetails: FC = () => {
  // Извлекаем ID ингредиента из URL — это наш пропуск к тайнам вкуса.
  const { id } = useParams();
  // Получаем текущую локацию, чтобы понять, открыты ли мы как модалка или как обычная страница.
  const location = useLocation();
  // Диспетчер для вызова экшенов — наш проводник в мир Redux.
  const dispatch = useDispatch();

  // Определяем, отображается ли компонент в виде модального окна.
  const isModal = !!location.state?.background;

  // Извлекаем состояние ингредиентов из глобального хранилища — здесь кроется весь список вкусов.
  const { items, isLoading, hasError } = useSelector(
    (state) => state.ingredients
  );

  /**
   * При первом появлении компонента запускаем магическую загрузку ингредиентов,
   * если список еще пуст. Ведь без ингредиентов не может быть ни вкуса, ни вдохновения.
   */
  useEffect(() => {
    if (!items.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, items.length]);

  // Если ингредиенты еще в пути, показываем индикатор ожидания.
  if (isLoading) {
    return <Preloader />;
  }
  // Если произошла ошибка, сообщаем об этом с заботой — даже в ошибках скрывается путь к совершенству.
  if (hasError) {
    return (
      <p className='text text_type_main-large'>
        Ошибка при загрузке ингредиентов
      </p>
    );
  }

  // Ищем нужный ингредиент по его уникальному ID. Здесь каждый элемент — отдельная история.
  const ingredientData = items.find((item) => item._id === id);
  if (!ingredientData) {
    return <p className='text text_type_main-large'>Ингредиент не найден</p>;
  }

  // Разные режимы отображения: модальное окно или полноэкранная страница.
  if (isModal) {
    // Если это модалка — UI сам позаботится о надписи, сохраняя легкость и простоту.
    return <IngredientDetailsUI ingredientData={ingredientData} />;
  } else {
    // Если страница полноэкранная, мы добавляем заголовок, чтобы погрузиться в детали ингредиента.
    return (
      <div className={styles.pageContainer}>
        <h2 className='text text_type_main-large pb-5'>Детали ингредиента</h2>
        <IngredientDetailsUI ingredientData={ingredientData} hideTitle />
      </div>
    );
  }
};
