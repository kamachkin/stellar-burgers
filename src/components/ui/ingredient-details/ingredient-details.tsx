import React, { FC, memo } from 'react';
import styles from './ingredient-details.module.css';
import { IngredientDetailsUIProps } from './type';

type TIngredientDetailsUIProps = IngredientDetailsUIProps & {
  /** Если true, не показываем встроенную надпись "Детали ингредиента" */
  hideTitle?: boolean;
};

export const IngredientDetailsUI: FC<TIngredientDetailsUIProps> = memo(
  ({ ingredientData, hideTitle = false }) => {
    const { name, image_large, calories, proteins, fat, carbohydrates } =
      ingredientData;

    return (
      <div className={styles.content}>
        {/* Только если hideTitle = false, показываем текст "Детали ингредиента" */}
        {!hideTitle && (
          <p className={`text text_type_main-large ${styles.title}`}>
            Детали ингредиента
          </p>
        )}

        <img
          className={styles.img}
          alt='изображение ингредиента.'
          src={image_large}
        />
        <h3 className='text text_type_main-medium mt-2 mb-4'>{name}</h3>
        <ul className={`${styles.nutritional_values} text_type_main-default`}>
          <li className={styles.nutritional_value}>
            <p className={`text mb-2 ${styles.text}`}>Калории, ккал</p>
            <p className='text text_type_digits-default'>{calories}</p>
          </li>
          <li className={styles.nutritional_value}>
            <p className={`text mb-2 ${styles.text}`}>Белки, г</p>
            <p className='text text_type_digits-default'>{proteins}</p>
          </li>
          <li className={styles.nutritional_value}>
            <p className={`text mb-2 ${styles.text}`}>Жиры, г</p>
            <p className='text text_type_digits-default'>{fat}</p>
          </li>
          <li className={styles.nutritional_value}>
            <p className={`text mb-2 ${styles.text}`}>Углеводы, г</p>
            <p className='text text_type_digits-default'>{carbohydrates}</p>
          </li>
        </ul>
      </div>
    );
  }
);
