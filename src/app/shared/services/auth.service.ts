import { inject, Injectable, signal, WritableSignal } from '@angular/core';
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

  provider = new GoogleAuthProvider();
  auth = getAuth();
  userData: WritableSignal<User | null> = signal(null);

  login(): void {
    signInWithPopup(this.auth, this.provider).then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      this.userData.set(result.user);
      this.router.navigate(['/chat']);
    });
  }

  logout(): void {
     signOut(this.auth)
       .then(() => {
         console.log('Logged out');
         this.userData.set(null);
         this.router.navigate(['/login']);
       })
       .catch((error) => {
         console.log(error);
       });
  }
}
