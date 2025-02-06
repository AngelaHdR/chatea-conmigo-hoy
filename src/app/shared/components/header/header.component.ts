import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UntilDestroy } from '@ngneat/until-destroy';
import { AuthService } from '../../services/auth.service';

@UntilDestroy()
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class HeaderComponent {
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
