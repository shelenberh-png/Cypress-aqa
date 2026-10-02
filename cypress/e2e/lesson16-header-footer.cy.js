describe('Header and Footer elements verification', () => {
  beforeEach(() => {
    // 1. Авторизація через Basic Auth та перехід на головну сторінку
    cy.visit('https://guest:welcome2qauto@qauto.forstudy.space/');
  });

  it('should find all buttons and links in the header', () => {
    cy.get('header').within(() => {
      // 1. Посилання Home
      cy.contains('a', 'Home')
        .should('be.visible')
        .and('have.attr', 'href', '/');

      // 2. Кнопка About
      cy.contains('button', 'About')
        .should('be.visible')
        .and('have.attr', 'appscrollto', 'aboutSection');

      // 3. Кнопка Contacts
      cy.contains('button', 'Contacts')
        .should('be.visible')
        .and('have.attr', 'appscrollto', 'contactsSection');

      // 4. Кнопка Guest log in
      cy.contains('button', 'Guest log in')
        .should('be.visible')
        .and('have.class', '-guest');

      // 5. Кнопка Sign In
      cy.contains('button', 'Sign In')
        .should('be.visible')
        .and('have.class', 'header_signin');

      // Перевірка загальної кількості елементів у хедері (1 посилання + 4 кнопки)
      cy.get('.header-link, .header_signin').should('have.length', 5);
    });
  });

  it('should find all links and contacts in the footer', () => {
    // 1. Прокручуємо сторінку до першого посилання соцмереж, щоб завантажився футер
    cy.get('.socials_link').first().scrollIntoView();

    // 2. Перевіряємо наявність та видимість усіх 5 посилань на соціальні мережі
    cy.get('.socials_link')
      .should('have.length', 5)
      .each(($el) => {
        cy.wrap($el).should('be.visible');
      });

    // 3. Точкова перевірка URL-адрес для кожної соцмережі
    cy.get('a[href*="facebook.com"]').should('be.visible');
    cy.get('a[href*="t.me"]').should('be.visible');
    cy.get('a[href*="youtube.com"]').should('be.visible');
    cy.get('a[href*="instagram.com"]').should('be.visible');
    cy.get('a[href*="linkedin.com"]').should('be.visible');

    // 4. Перевірка контактних посилань (ithillel.ua та email підтримки)
    cy.contains('a.contacts_link', 'ithillel.ua')
      .should('be.visible')
      .and('have.attr', 'href', 'https://ithillel.ua');

    cy.contains('a.contacts_link', 'support@ithillel.ua')
      .should('be.visible')
      .and('have.attr', 'href', 'mailto:developer@ithillel.ua');
  });
});