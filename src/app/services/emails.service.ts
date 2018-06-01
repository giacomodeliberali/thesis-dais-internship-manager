import { BaseService } from "./base.service";
import { injectable } from "inversify";
import { User, ApiResponseDto, Internship, Company } from "gdl-thesis-core/dist";
import { MailOptions } from "../models/mail-options.interface";
/**
 * The emails service
 *
 * @extends {BaseService}
 */
@injectable()
export class EmailsService extends BaseService {

    /**
     * Send a new email with the specified options
     *
     * @param {MailOptions} options The options
     */
    send(options: MailOptions): Promise<ApiResponseDto<any>> {
        return this.postVerb('emails/send', options);
    }
}

