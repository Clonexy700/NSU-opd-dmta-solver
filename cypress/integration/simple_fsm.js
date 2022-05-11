describe('Build basic FSS', () => {
    it('visit app', () => {
        cy.visit('http://localhost:5000/stateMachine');
    });

    it('build state', () => {
        cy.get('canvas').dblclick();
        cy.get('canvas').click({ shiftKey: true });
        cy.contains('Draw Table').click();
        //
        cy.get('.t_tbl').invoke('text').then((text) => {
            //State S0, on input "" outputs "" and goes to S0
            expect(text.replace(/(\r\n|\n|\r|\s)/gm, "")).equal('S0εS0');
        });
    });
});