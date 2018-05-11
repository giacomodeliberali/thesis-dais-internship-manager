import { BaseService } from "./base.service";
import { injectable } from "inversify";
import { User, ApiResponseDto, Internship, Company } from "gdl-thesis-core/dist";

@injectable()
export class EmailsService extends BaseService {

    send(options: MailOptions): Promise<ApiResponseDto<any>> {
        return this.postVerb('emails/send', options);
    }
}

export interface MailOptions {
    text?: string;
    html?: string;
    subject: string;
    to: Array<string>;
}