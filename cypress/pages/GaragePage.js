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

  // Створює випадкове авто через UI, перехоплює POST /api/cars,
  // валідує статус і повертає дані створеного авто (включно з id)
  addRandomCar(mileage) {
    // Інтерсепт ставимо ДО кліку на Add
    cy.intercept('POST', '**/api/cars').as('createCar');

    this.addCarButton.click();
    this.brandSelect.should('be.visible');

    let brandText;
    let modelText;

    // 1. Бренд, відмінний від поточного
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

      // 2. Чекаємо, поки моделі оновляться під новий бренд
      this.modelSelect
        .find('option')
        .first()
        .should(($o) => {
          expect($o.text().trim()).not.to.eq(staleModel.trim());
        });
    });

    // 3. Випадкова модель
    this.modelSelect.find('option').then(($options) => {
      const models = [...$options].map((o) => o.textContent.trim()).filter(Boolean);
      modelText = models[Math.floor(Math.random() * models.length)];
      this.modelSelect.select(modelText);
    });

    // 4. Пробіг і сабміт
    this.mileageInput.clear().type(String(mileage));
    this.submitButton.should('not.be.disabled').click();

    // 5. Перехоплений запит: валідація статусу й тіла
    return cy.wait('@createCar').then(({ request, response }) => {
      expect(response.statusCode, 'create car status').to.eq(201);
      expect(response.body.status).to.eq('ok');

      const car = response.body.data;
      expect(car.id, 'car id').to.be.a('number');
      expect(car.carBrandId).to.eq(request.body.carBrandId);
      expect(car.carModelId).to.eq(request.body.carModelId);
      expect(car.brand).to.eq(brandText);
      expect(car.model).to.eq(modelText);
      expect(car.mileage).to.eq(Number(mileage));

      cy.get('.modal-content').should('not.exist');
      this.carByName(`${brandText} ${modelText}`).should('be.visible');

      return cy.wrap({
        id: car.id,
        brandId: car.carBrandId,
        modelId: car.carModelId,
        brand: brandText,
        model: modelText,
        name: `${brandText} ${modelText}`,
        mileage: Number(mileage),
      });
    });
  }
}

export default new GaragePage();