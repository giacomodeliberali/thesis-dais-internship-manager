import { MissingTranslationHandler, MissingTranslationHandlerParams } from "@ngx-translate/core";
/**
 * The custom missing translation handler for ngx-translate
 *
 * @implements {MissingTranslationHandler}
 */
export class MyMissingTranslationHandler implements MissingTranslationHandler {

    /**
     * Handle a new missing translation. Return the missing key surrounded by square brackets
     *
     * @param {MissingTranslationHandlerParams} params The parameters from the template
     */
    handle(params: MissingTranslationHandlerParams) {
        console.log(`Missing translation for '${params.key}'`)
        return `[${params.key}]`;
    }
}