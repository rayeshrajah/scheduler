describe("Navigation", () => {
  before(() => {
    cy.visit("/");
  }) 
  it("should visits root", () => {
  });
  it("should navigate to Tuesday", () => {
    cy.contains("[data-testid=day]", "Tuesday")
      .click()
      .should("have.class", "day-list__item--selected");
  })
});