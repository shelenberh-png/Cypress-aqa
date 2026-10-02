class GaragePage {
  get addCarButton() {
    return cy.contains('button', 'Add car');
  }

  get brandSelect() {
    return cy.get('#addCarBrand');
  }

  get modelSelect() {
    return cy.get('#addCarModel');
  }

  get mileageInput() {
    return cy.get('#addCarMileage');
  }

  get submitButton() {
    return cy.get('.modal-footer').contains('button', 'Add');
  }

  carByName(name) {
    return cy.contains('.car_name', name);
  }

  // Повертає Cypress-chain з назвою створеного авто, напр. "BMW X5"
  addRandomCar(mileage) {
    this.addCarButton.click();
    this.brandSelect.should('be.visible');

    let brandText;
    let modelText;

    // 1. Запам'ятовуємо стан ДО зміни бренду
    this.modelSelect.find('option').first().invoke('text').then((staleModel) => {
      this.brandSelect.find('option:selected').invoke('text').then((currentBrand) => {
        this.brandSelect.find('option').then(($options) => {
          const brands = [...$options]
            .map((o) => o.textContent.trim())
            .filter((t) => t && t !== currentBrand.trim());

          brandText = brands[Math.floor(Math.random() * brands.length)];
          this.brandSelect.select(brandText);
        });
      });

      // 2. Чекаємо, поки список моделей оновиться під новий бренд
      this.modelSelect
        .find('option')
        .first()
        .should(($o) => {
          expect($o.text().trim()).not.to.eq(staleModel.trim());
        });
    });

    // 3. Обираємо випадкову модель за текстом
    this.modelSelect.find('option').then(($options) => {
      const models = [...$options].map((o) => o.textContent.trim()).filter(Boolean);
      modelText = models[Math.floor(Math.random() * models.length)];
      this.modelSelect.select(modelText);
    });

    // 4. Пробіг і сабміт
    this.mileageInput.clear().type(mileage);
    this.submitButton.should('not.be.disabled').click();

    // 5. Модалка закрилась, авто з'явилось у списку
    cy.get('.modal-content').should('not.exist');

    return cy.then(() => {
      const carName = `${brandText} ${modelText}`;
      this.carByName(carName).should('be.visible');
      return cy.wrap(carName);
    });
  }
}

export default new GaragePage();