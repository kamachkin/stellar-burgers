/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * Выполняет вход пользователя в систему
       * @param email - электронная почта пользователя
       * @param password - пароль пользователя
       */
      login(email: string, password: string): Chainable<void>;

      /**
       * Создает заказ с указанными ингредиентами
       * @param ingredients - массив ID ингредиентов
       */
      createOrder(ingredients: string[]): Chainable<void>;

      /**
       * Получает все доступные ингредиенты
       */
      getIngredients(): Chainable<any>;

      /**
       * Перехватывает сетевые запросы
       * @param method - HTTP метод
       * @param url - URL запроса
       */
      intercept(method: string, url: string): Chainable<void>;
    }
  }
}

// Необходимо экспортировать пустой объект для корректной работы модуля
export {};
