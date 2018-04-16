/**
 * The Dependency Injection symbols (used to inject interfaces)
 */
export const types = {
    /** The express application */
    App: Symbol.for("App"),

    /** The mongoose schema models */
    Models: {
        Company: Symbol.for("CompanyModel"),
        InternShip: Symbol.for("InternShipModel"),
        InternShipProposal: Symbol.for("InternShipProposalModel"),
        User: Symbol.for("UserModel"),
        Role: Symbol.for("RoleModel")
    }
};