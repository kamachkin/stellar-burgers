//@ts-ignore
// Константы для часто используемых селекторов
const SELECTORS = {
  INGREDIENT_CARD: '[class^="ingredient-card_card"]',
  MODAL_CLOSE: '[class^="modal_close"]',
  CONSTRUCTOR_ELEMENT: '[class^="constructor-element"]',
  BURGER_CONSTRUCTOR: '[class^="burger-constructor_burger"]',
  INGREDIENT_DETAILS: '[class^="ingredient-details"]',
  INGREDIENT_NAME: '[class^="ingredient-card_name"]',
  ORDER_DETAILS: '[class^="order-details"]',
  ORDER_NUMBER: '[class^="order-details_order-number"]',
  CONSTRUCTOR_ELEMENT_BASKET: '[class^="constructor-element_basket"]'
};
//@ts-ignore
describe('Stellar Burgers - Функционал конструктора бургера', function() {
  //@ts-ignore
  beforeEach(function() {
    // Перехватываем запрос ингредиентов
    //@ts-ignore
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', { fixture: 'example.json' }).as('getIngredients');
    
    // Перехватываем запрос создания заказа
    //@ts-ignore
    cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', { fixture: 'order.json' }).as('createOrder');
    
    // Перехватываем запрос данных пользователя
    //@ts-ignore
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', { fixture: 'user.json' }).as('getUser');
    
    cy.visit('/');
    cy.wait('@getIngredients');
  });
//@ts-ignore
  it('Должен добавлять ингредиент из списка в конструктор', function() {
    // Находим первую булку и кликаем по ней
    cy.get(SELECTORS.INGREDIENT_CARD).first().click();
    
    // Закрываем модальное окно, если оно открылось
    cy.get('body').then(($body) => {
      if ($body.find(SELECTORS.MODAL_CLOSE).length > 0) {
        cy.get(SELECTORS.MODAL_CLOSE).click();
      }
    });
    
    // Добавляем булку в конструктор
    cy.get(SELECTORS.INGREDIENT_CARD).first().find('button').click();
    
    // Проверяем, что ингредиент добавился в конструктор
    cy.get(SELECTORS.BURGER_CONSTRUCTOR).should('exist');
    cy.get(SELECTORS.CONSTRUCTOR_ELEMENT).should('exist');
    
    // Проверяем, что в конструкторе есть булка
    cy.get(SELECTORS.CONSTRUCTOR_ELEMENT).contains('булка').should('exist');
  });
//@ts-ignore
  it('Должен открывать и закрывать модальное окно с описанием ингредиента', function() {
    // Клик по ингредиенту для открытия деталей
    cy.get(SELECTORS.INGREDIENT_CARD).first().click();
    
    // Проверка, что модальное окно открылось
    cy.contains('Детали ингредиента').should('be.visible');
    
    // Проверка наличия информации о пищевой ценности
    cy.get(SELECTORS.INGREDIENT_DETAILS).within(() => {
      cy.contains('Калории').should('be.visible');
      cy.contains('Белки').should('be.visible');
      cy.contains('Жиры').should('be.visible');
      cy.contains('Углеводы').should('be.visible');
    });
    
    // Закрытие модального окна
    cy.get(SELECTORS.MODAL_CLOSE).click();
    cy.contains('Детали ингредиента').should('not.exist');
  });
//@ts-ignore
  it('Должен отображать в модальном окне данные того ингредиента, по которому произошел клик', function() {
    // Находим имя первого ингредиента
    let firstIngredientName;
    cy.get(SELECTORS.INGREDIENT_CARD).first().find(SELECTORS.INGREDIENT_NAME).then(($name) => {
      firstIngredientName = $name.text();
      
      // Кликаем по первому ингредиенту
      cy.get(SELECTORS.INGREDIENT_CARD).first().click();
      
      // Проверяем, что в модальном окне отображается имя этого ингредиента
      cy.get(SELECTORS.INGREDIENT_DETAILS).contains(firstIngredientName).should('be.visible');
      
      // Закрываем модальное окно
      cy.get(SELECTORS.MODAL_CLOSE).click();
      
      // Находим имя другого ингредиента (5-го в списке)
      let secondIngredientName;
      cy.get(SELECTORS.INGREDIENT_CARD).eq(4).find(SELECTORS.INGREDIENT_NAME).then(($secondName) => {
        secondIngredientName = $secondName.text();
        
        // Кликаем по этому ингредиенту
        cy.get(SELECTORS.INGREDIENT_CARD).eq(4).click();
        
        // Проверяем, что в модальном окне отображается имя этого ингредиента
        cy.get(SELECTORS.INGREDIENT_DETAILS).contains(secondIngredientName).should('be.visible');
        
        // Закрываем модальное окно
        cy.get(SELECTORS.MODAL_CLOSE).click();
      });
    });
  });
//@ts-ignore
  it('Должен проходить процесс создания заказа и очищать конструктор после оформления', function() {
    // Устанавливаем фейковые токены авторизации перед тестом
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'fake-refresh-token');
      win.document.cookie = 'accessToken=Bearer fake-access-token; path=/';
    });
    
    // Добавляем булку в конструктор
    cy.get(SELECTORS.INGREDIENT_CARD).first().click();
    cy.get('body').then(($body) => {
      if ($body.find(SELECTORS.MODAL_CLOSE).length > 0) {
        cy.get(SELECTORS.MODAL_CLOSE).click();
      }
    });
    cy.get(SELECTORS.INGREDIENT_CARD).first().find('button').click();
    
    // Добавляем соус
    cy.contains('Соусы').click();
    cy.get(SELECTORS.INGREDIENT_CARD).contains('Соус').first().click();
    cy.get('body').then(($body) => {
      if ($body.find(SELECTORS.MODAL_CLOSE).length > 0) {
        cy.get(SELECTORS.MODAL_CLOSE).click();
      }
    });
    cy.get(SELECTORS.INGREDIENT_CARD).contains('Соус').first().find('button').click();
    
    // Добавляем начинку
    cy.contains('Начинки').click();
    cy.get(SELECTORS.INGREDIENT_CARD).contains('Мясо').click();
    cy.get('body').then(($body) => {
      if ($body.find(SELECTORS.MODAL_CLOSE).length > 0) {
        cy.get(SELECTORS.MODAL_CLOSE).click();
      }
    });
    cy.get(SELECTORS.INGREDIENT_CARD).contains('Мясо').find('button').click();
    
    // Проверяем, что ингредиенты добавились в конструктор
    cy.get(SELECTORS.BURGER_CONSTRUCTOR).find(SELECTORS.CONSTRUCTOR_ELEMENT).should('have.length.at.least', 1);
    
    // Нажимаем на кнопку "Оформить заказ"
    cy.contains('Оформить заказ').click();
    
    // Ждем ответа от сервера по созданию заказа
    cy.wait('@createOrder');
    
    // Проверяем, что модальное окно с информацией о заказе отобразилось
    cy.get(SELECTORS.ORDER_DETAILS).should('be.visible');
    
    // Проверяем, что номер заказа правильный
    cy.get(SELECTORS.ORDER_NUMBER).should('contain', '12345');
    
    // Закрываем модальное окно
    cy.get(SELECTORS.MODAL_CLOSE).click();
    
    // Проверяем, что конструктор очистился
    cy.get(SELECTORS.BURGER_CONSTRUCTOR).should('exist');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR).find(SELECTORS.CONSTRUCTOR_ELEMENT_BASKET).should('not.exist');
    
    // Очищаем токены авторизации после теста
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
      win.document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    });
  });
});