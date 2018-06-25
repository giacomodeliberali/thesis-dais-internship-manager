export abstract class Defaults {

    /** The MongoDB collections name */
    public static collectionsName = {
        /** The [[User]] collection */
        users: "users",

        /** The [[Role]] collect
         * ion  */
        roles: "roles",

        /** The [[Company]] collection  */
        companies: "companies",

        /** The [[Internship]] collection  */
        internships: "internships",
        
        /** The [[InternshipProposal]] collection  */
        internshipProposals: "internshipProposals"
    };
}