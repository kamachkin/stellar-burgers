/// <reference types="cypress" />
/// <reference path="./index.d.ts" />

// Расширяем интерфейс пользовательских команд
//@ts-ignore
Cypress.Commands.add('login', (email: string, password: string) => {
    cy.request({
      method: 'POST',
      url: 'https://norma.nomoreparties.space/api/auth/login',
      body: { email, password }
    }).then((response) => {
      localStorage.setItem('refreshToken', response.body.refreshToken);
      document.cookie = `accessToken=${response.body.accessToken}; path=/`;
    });
    
    // Перезагрузим страницу после авторизации
    cy.visit('/');
});
//@ts-ignore
Cypress.Commands.add('createOrder', (ingredients: string[]) => {
    // Реализация команды
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];

    cy.request({
      method: 'POST',
      url: 'https://norma.nomoreparties.space/api/orders',
      headers: {
        'Authorization': token
      },
      body: { ingredients }
    });
});
//@ts-ignore
Cypress.Commands.add('getIngredients', () => {
    return cy.request('GET', 'https://norma.nomoreparties.space/api/ingredients')
      .then((response) => {
        return response.body.data;
      });
});

// Экспорт для TypeScript
export {};
