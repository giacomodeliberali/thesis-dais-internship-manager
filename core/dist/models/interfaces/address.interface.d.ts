/** Rappresent a physical address */
export interface Address {
    /** The street */
    street: string;
    /** The street number */
    number: string;
    /** The floor */
    floor: string;
    /** The city */
    city: string;
    /** The zip code (CAP) */
    zip: string;
    /** The state (provincia) */
    state: string;
    /** The country (nazione) */
    country: string;
}
