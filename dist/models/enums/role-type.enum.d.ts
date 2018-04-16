/**
 * The application [[User]] role types.
 * Each [[Role]] can have multiples types, so this is a Map and must be used with bitwise operations
 *
 * For more info on how to use flags check:
 *  - http://www.alanzucconi.com/2015/07/26/enum-flags-and-bitwise-operators/
 */
export declare enum RoleType {
    /** The student. Can see internship and create an [[InternshipProposal]] */
    Student = 1,
    /** The professor. Must confirm its presence in an [[InternshipProposal]] */
    Tutor = 2,
    /** The company. Can create an [[Internship]] */
    Company = 4,
    /** The admin. Can approve [[Internship]] */
    Admin = 8,
}
