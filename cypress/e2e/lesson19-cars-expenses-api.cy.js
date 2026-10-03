import dayjs from 'dayjs';
import garagePage from '../pages/GaragePage';
import expensesPage from '../pages/ExpensesPage';

describe('Cars and expenses: interception + API', () => {
  // Дані створеної машини (id з перехопленого респонсу) діляться між тестами
  let car;

  const expense = { mileage: 15500, liters: 45, totalCost: 1800 };
  const reportedAt = dayjs().format('YYYY-MM-DD');

  beforeEach(() => {
    cy.visit('/');
    cy.contains('button', 'Sign In').click();

    cy.get('#signinEmail').type(Cypress.expose('userEmail'));
    cy.env(['userPassword']).then(({ userPassword }) => {
      cy.get('#signinPassword').type(userPassword, { log: false });
    });

    cy.get('.modal-footer .btn-primary').click();
    cy.url().should('include', '/panel/garage');
  });

  it('1. creates a car via UI and captures its id from the intercepted response', () => {
    garagePage.addRandomCar(15000).then((created) => {
      car = created;
      expect(car.id).to.be.a('number');
    });
  });

  it('2. GET /api/cars contains the created car', () => {
    expect(car, 'car from test 1').to.exist;

    cy.getCarsApi().then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.status).to.eq('ok');

      const found = res.body.data.find((c) => c.id === car.id);
      expect(found, `car with id ${car.id} in list`).to.exist;
      expect(found).to.include({
        carBrandId: car.brandId,
        carModelId: car.modelId,
        brand: car.brand,
        model: car.model,
        mileage: car.mileage,
      });
    });
  });

  it('3. creates an expense for the car via API', () => {
    expect(car, 'car from test 1').to.exist;

    cy.createExpenseApi({ carId: car.id, reportedAt, ...expense }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.status).to.eq('ok');

      const data = res.body.data;
      expect(data.id).to.be.a('number');
      expect(data.carId).to.eq(car.id);
      expect(data.reportedAt).to.include(reportedAt);
      expect(Number(data.mileage)).to.eq(expense.mileage);
      expect(Number(data.liters)).to.eq(expense.liters);
      expect(Number(data.totalCost)).to.eq(expense.totalCost);
    });
  });

  it('4. shows the API-created expense in the UI for that car', () => {
    expect(car, 'car from test 1').to.exist;

    expensesPage.open();
    expensesPage.selectCar(car.name);

    expensesPage.expensesTableRows
      .should('have.length', 1)
      .first()
      .should('contain', dayjs(reportedAt).format('DD.MM.YYYY'))
      .and('contain', String(expense.mileage))
      .and('contain', `${expense.liters}L`)
      .and('contain', `${expense.totalCost}.00 USD`);
  });
});