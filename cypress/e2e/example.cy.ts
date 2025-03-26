//@ts-ignore
describe('Stellar Burgers - Функционал конструктора бургера', function() {
  //@ts-ignore
  beforeEach(function() {
    // Перехватываем запрос ингредиентов
    //@ts-ignore
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    
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
    cy.get('[class^="ingredient-card_card"]').first().click();
    
    // Закрываем модальное окно, если оно открылось
    cy.get('body').then(($body) => {
      if ($body.find('[class^="modal_close"]').length > 0) {
        cy.get('[class^="modal_close"]').click();
      }
    });
    
    // Добавляем булку в конструктор
    cy.get('[class^="ingredient-card_card"]').first().find('button').click();
    
    // Проверяем, что ингредиент добавился в конструктор
    cy.get('[class^="burger-constructor_burger"]').should('exist');
    cy.get('[class^="constructor-element"]').should('exist');
    
    // Проверяем, что в конструкторе есть булка
    cy.get('[class^="constructor-element"]').contains('булка').should('exist');
  });
//@ts-ignore
  it('Должен открывать и закрывать модальное окно с описанием ингредиента', function() {
    // Клик по ингредиенту для открытия деталей
    cy.get('[class^="ingredient-card_card"]').first().click();
    
    // Проверка, что модальное окно открылось
    cy.contains('Детали ингредиента').should('be.visible');
    
    // Проверка наличия информации о пищевой ценности
    cy.get('[class^="ingredient-details"]').within(() => {
      cy.contains('Калории').should('be.visible');
      cy.contains('Белки').should('be.visible');
      cy.contains('Жиры').should('be.visible');
      cy.contains('Углеводы').should('be.visible');
    });
    
    // Закрытие модального окна
    cy.get('[class^="modal_close"]').click();
    cy.contains('Детали ингредиента').should('not.exist');
  });
//@ts-ignore
  it('Должен отображать в модальном окне данные того ингредиента, по которому произошел клик', function() {
    // Находим имя первого ингредиента
    let firstIngredientName;
    cy.get('[class^="ingredient-card_card"]').first().find('[class^="ingredient-card_name"]').then(($name) => {
      firstIngredientName = $name.text();
      
      // Кликаем по первому ингредиенту
      cy.get('[class^="ingredient-card_card"]').first().click();
      
      // Проверяем, что в модальном окне отображается имя этого ингредиента
      cy.get('[class^="ingredient-details"]').contains(firstIngredientName).should('be.visible');
      
      // Закрываем модальное окно
      cy.get('[class^="modal_close"]').click();
      
      // Находим имя другого ингредиента (5-го в списке)
      let secondIngredientName;
      cy.get('[class^="ingredient-card_card"]').eq(4).find('[class^="ingredient-card_name"]').then(($secondName) => {
        secondIngredientName = $secondName.text();
        
        // Кликаем по этому ингредиенту
        cy.get('[class^="ingredient-card_card"]').eq(4).click();
        
        // Проверяем, что в модальном окне отображается имя этого ингредиента
        cy.get('[class^="ingredient-details"]').contains(secondIngredientName).should('be.visible');
        
        // Закрываем модальное окно
        cy.get('[class^="modal_close"]').click();
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
    cy.get('[class^="ingredient-card_card"]').first().click();
    cy.get('body').then(($body) => {
      if ($body.find('[class^="modal_close"]').length > 0) {
        cy.get('[class^="modal_close"]').click();
      }
    });
    cy.get('[class^="ingredient-card_card"]').first().find('button').click();
    
    // Добавляем соус
    cy.contains('Соусы').click();
    cy.get('[class^="ingredient-card_card"]').contains('Соус').first().click();
    cy.get('body').then(($body) => {
      if ($body.find('[class^="modal_close"]').length > 0) {
        cy.get('[class^="modal_close"]').click();
      }
    });
    cy.get('[class^="ingredient-card_card"]').contains('Соус').first().find('button').click();
    
    // Добавляем начинку
    cy.contains('Начинки').click();
    cy.get('[class^="ingredient-card_card"]').contains('Мясо').click();
    cy.get('body').then(($body) => {
      if ($body.find('[class^="modal_close"]').length > 0) {
        cy.get('[class^="modal_close"]').click();
      }
    });
    cy.get('[class^="ingredient-card_card"]').contains('Мясо').find('button').click();
    
    // Проверяем, что ингредиенты добавились в конструктор
    cy.get('[class^="burger-constructor_burger"]').find('[class^="constructor-element"]').should('have.length.at.least', 1);
    
    // Нажимаем на кнопку "Оформить заказ"
    cy.contains('Оформить заказ').click();
    
    // Ждем ответа от сервера по созданию заказа
    cy.wait('@createOrder');
    
    // Проверяем, что модальное окно с информацией о заказе отобразилось
    cy.get('[class^="order-details"]').should('be.visible');
    
    // Проверяем, что номер заказа правильный
    cy.get('[class^="order-details_order-number"]').should('contain', '12345');
    
    // Закрываем модальное окно
    cy.get('[class^="modal_close"]').click();
    
    // Проверяем, что конструктор очистился
    cy.get('[class^="burger-constructor_burger"]').should('exist');
    cy.get('[class^="burger-constructor_burger"]').find('[class^="constructor-element_basket"]').should('not.exist');
    
    // Очищаем токены авторизации после теста
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
      win.document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    });
  });
});