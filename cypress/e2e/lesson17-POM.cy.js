import homePage from '../pages/HomePage';

describe('Header and Footer elements verification (POM)', () => {
  beforeEach(() => {
    // Авторизація через Basic Auth та відкриття сторінки
    homePage.open();
  });

  it('should find all buttons and links in the header', () => {
    homePage.header.within(() => {
      // 1. Посилання Home
      homePage.homeLink
        .should('be.visible')
        .and('have.attr', 'href', '/');

      // 2. Кнопка About
      homePage.aboutButton
        .should('be.visible')
        .and('have.attr', 'appscrollto', 'aboutSection');

      // 3. Кнопка Contacts
      homePage.contactsButton
        .should('be.visible')
        .and('have.attr', 'appscrollto', 'contactsSection');

      // 4. Кнопка Guest log in
      homePage.guestLogInButton
        .should('be.visible')
        .and('have.class', '-guest');

      // 5. Кнопка Sign In
      homePage.signInButton
        .should('be.visible')
        .and('have.class', 'header_signin');

      // Загальна кількість елементів у хедері
      homePage.headerElements.should('have.length', 5);
    });
  });

  it('should find all links and contacts in the footer', () => {
    // 1. Прокручуємо до футера
    homePage.scrollToFooter();

    // 2. Перевірка видимості усіх 5 посилань соцмереж
    homePage.socialLinks
      .should('have.length', 5)
      .each(($el) => {
        cy.wrap($el).should('be.visible');
      });

    // 3. Перевірка окремих соцмереж
    homePage.facebookLink.should('be.visible');
    homePage.telegramLink.should('be.visible');
    homePage.youtubeLink.should('be.visible');
    homePage.instagramLink.should('be.visible');
    homePage.linkedinLink.should('be.visible');

    // 4. Перевірка контактних посилань
    homePage.hillelWebsiteLink
      .should('be.visible')
      .and('have.attr', 'href', 'https://ithillel.ua');

    homePage.hillelSupportEmailLink
      .should('be.visible')
      .and('have.attr', 'href', 'mailto:developer@ithillel.ua');
  });
});