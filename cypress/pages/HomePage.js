class HomePage {
  // --- Елементи Хедера ---
  get header() {
    return cy.get('header');
  }

  get homeLink() {
    return cy.contains('a', 'Home');
  }

  get aboutButton() {
    return cy.contains('button', 'About');
  }

  get contactsButton() {
    return cy.contains('button', 'Contacts');
  }

  get guestLogInButton() {
    return cy.contains('button', 'Guest log in');
  }

  get signInButton() {
    return cy.contains('button', 'Sign In');
  }

  get headerElements() {
    return cy.get('.header-link, .header_signin');
  }

  // --- Елементи Футера / Соцмереж ---
  get socialLinks() {
    return cy.get('.socials_link');
  }

  get facebookLink() {
    return cy.get('a[href*="facebook.com"]');
  }

  get telegramLink() {
    return cy.get('a[href*="t.me"]');
  }

  get youtubeLink() {
    return cy.get('a[href*="youtube.com"]');
  }

  get instagramLink() {
    return cy.get('a[href*="instagram.com"]');
  }

  get linkedinLink() {
    return cy.get('a[href*="linkedin.com"]');
  }

  // --- Контактні посилання ---
  get hillelWebsiteLink() {
    return cy.contains('a.contacts_link', 'ithillel.ua');
  }

  get hillelSupportEmailLink() {
    return cy.contains('a.contacts_link', 'support@ithillel.ua');
  }

  // --- Методи дій (Actions) ---
  open() {
    cy.visit('https://guest:welcome2qauto@qauto.forstudy.space/');
  }

  scrollToFooter() {
    this.socialLinks.first().scrollIntoView();
  }
}

export default new HomePage();