import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';


@Component({
	moduleId: module.id,
	selector: 'user-view-cmp',
	templateUrl: 'user-view.component.html'
})
export class UserViewComponent {
	constructor(
		public authService: AuthService) {

	}
}
