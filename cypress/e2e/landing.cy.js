describe("EchoWell Landing", () => {
  it("renders hero content", () => {
    cy.visit("/");
    cy.contains("EchoWell Mental Wellness");
    cy.contains("Create Free Account");
  });
});
