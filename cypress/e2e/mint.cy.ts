describe("mint", () => {
  beforeEach(() => {
    cy.visit("/mint");
  });

  it("allows navigation to mint", () => {
    cy.url().should("include", "/mint");
  });

  // it("should be disabled with an invalid address", () => {
  //   cy.get("#mint-address-input-panel .recipient-address-input").type("invalid address");
  //   // #mint-button should be disabled
  //   cy.get("#mint-button").should("be.disabled");
  // });

  // it("Disables the button when loading", () => {
  //   cy.get("#mint-page input").type("valid address");
  //   cy.get("ButtonError").then(($button) => {
  //     if ($button.is(":disabled")) {
  //       cy.get("ButtonError").should("contain", "Loading...");
  //     }
  //   });
  // });

  // it("Shows an error message when the WebSocket fails", () => {
  //   // To do this, you'll need to mock a WebSocket connection failure.
  //   // This will depend on your implementation and may not be possible with just Cypress.
  // });

  // it("Displays an error when not on the Boltchain network", () => {
  //   // Assuming you have some way of mocking the network context.
  //   // This will depend on your implementation.
  // });

  // it("Changes button text and functionality when the network is switched to Boltchain", () => {
  //   // Assuming you have some way of mocking the network context.
  //   // This will depend on your implementation.
  //   cy.get("ButtonError").click();
  //   cy.get("ButtonError").should("contain", "Send Me ETH");
  // });
});
