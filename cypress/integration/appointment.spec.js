describe("Appointments", () => {
  beforeEach(() => {
    cy.request("GET", "http://localhost:8001/api/debug/reset");
    
    cy.visit("/");
    
    cy.contains('Monday');
  });
  
  it("should book an interview", () => {
  cy.contains("[data-testid=day]", "Tuesday").click();
  cy.get("[alt=Add]")
    .first()
    .click();
 cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones");
 cy.get("[alt='Sylvia Palmer']").click();
 cy.contains("Save").click();
 cy.contains(".appointment__card--show", "Lydia Miller-Jones");
 cy.contains(".appointment__card--show", "Sylvia Palmer");
  });

  it("should edit an interview", () => {
    cy.get('[alt=Edit]').click({force: true});
    cy.get("[alt='Tori Malcolm']").click();
    cy.get("[data-testid=student-name-input]")
      .clear()
      .type("Rayesh Rajah");
      cy.contains("Save").click();
      cy.contains(".appointment__card--show", "Rayesh Rajah");
      cy.contains(".appointment__card--show", "Tori Malcolm");  
  })
  it("should cancel an interview", () => {
    cy.get("[alt=Delete]").click({force: true})
    cy.contains("Confirm").click();
    cy.contains("DELETING").should('exist');
    cy.contains("DELETING").should('not.exist');
    cy.contains(".appointment__card--show", "Archie Cohen").should('not.exist');
  })
})