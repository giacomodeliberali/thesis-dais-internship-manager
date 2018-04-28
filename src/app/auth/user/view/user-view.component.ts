import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';

declare var $;

@Component({
	moduleId: module.id,
	selector: 'user-view-cmp',
	templateUrl: 'user-view.component.html'
})
export class UserViewComponent {

	public currentLanguage: string;

	constructor(
		public authService: AuthService,
		private translateService: TranslateService) {

		this.currentLanguage = this.translateService.currentLang;
	}

	onChangeLanguage() {
		console.log("Use " + this.currentLanguage);
		localStorage.setItem('default:culture', this.currentLanguage);
		window.location.reload();
	}

	ngOnInit() {
		setTimeout(() => {
			$(".selectpicker").selectpicker();
		}, 200);

	}
}
