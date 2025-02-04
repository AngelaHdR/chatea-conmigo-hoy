import { User } from 'firebase/auth';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public userActive?: User;

  ngOnInit(): void {
    this.authService.userData$.pipe(untilDestroyed(this)).subscribe((user) => {
      this.userActive = user;
    });
  }

  logout() {
    this.authService.logout();
  }
}

