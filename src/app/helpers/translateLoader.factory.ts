import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from "@angular/common/http";

/**
 * Create a new translate loader for globalization
 * @param http The http client used to fetch the globalization json
 */
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/globalization/', '.json');
}