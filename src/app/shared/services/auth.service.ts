import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);

  public provider = new GoogleAuthProvider();
  public auth = getAuth();
  public userData = new BehaviorSubject<User | undefined>(undefined);
  userData$ = this.userData.asObservable();

  login(): void {
    signInWithPopup(this.auth, this.provider).then((result: any) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      this.getUserData();
      this.router.navigate(['/chat']);
    });
  }

  logout(): void {
    signOut(this.auth)
      .then(() => {
        console.log('Logged out');
        this.userData.next(undefined);
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getUserData(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userData.next(user);
      }
    });
  }
}
