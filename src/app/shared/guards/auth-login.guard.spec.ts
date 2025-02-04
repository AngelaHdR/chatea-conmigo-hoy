import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authLoginGuard } from './auth-login.guard';

describe('authLoginGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authLoginGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
