//
describe('Build basic FSS', () => {
    it('visit app', () => {
        cy.visit('http://localhost:5000/stateMachine');
    });

    it('build state', () => {
        cy.get('canvas').dblclick();
        cy.get('canvas').click({ shiftKey: true });
        cy.contains('Нарисовать таблицу').click();
    });
});