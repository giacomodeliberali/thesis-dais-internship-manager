/**
 * The email options
 */
export interface MailOptions {
    text?: string;
    html?: string;
    subject: string;
    to: Array<string>;
}