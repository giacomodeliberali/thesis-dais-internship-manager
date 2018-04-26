import { MissingTranslationHandler, MissingTranslationHandlerParams } from "@ngx-translate/core";

export class MyMissingTranslationHandler implements MissingTranslationHandler {

    handle(params: MissingTranslationHandlerParams) {
        console.info(`Missing translation for '${params.key}'`)
        return `[${params.key}]`;
    }
}