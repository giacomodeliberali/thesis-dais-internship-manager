import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * The app container
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('it');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    let currentLanguage = localStorage.getItem("default:culture") || "it";

    // if the current lang is not it or en, fallback to it
    if (!['it', 'en'].includes(currentLanguage))
      currentLanguage = "it";

    // update local storage value
    localStorage.setItem("default:culture", currentLanguage);

    // use the value
    translate.use(currentLanguage);
  }
}
