/// <reference types="cypress" />

// Делаем Cypress доступным глобально
declare namespace NodeJS {
  interface Global {
    Cypress: typeof Cypress;
    cy: typeof cy;
  }
}

interface Window {
  Cypress?: any;
}