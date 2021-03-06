import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private tokenKey = 'jwt';
  private jwtHelper = new JwtHelperService();

  getToken(): string|undefined {
    console.log('JWT Service: getToken');

    return window.sessionStorage[this.tokenKey];
  }

  saveToken(token: string) {
    console.log('JWT Service: saveToken');

    window.sessionStorage[this.tokenKey] = token;
  }

  destroyToken() {
    console.log('JWT Service: destroyToken');

    window.sessionStorage.removeItem(this.tokenKey);
  }

  decodeToken(rawToken: string): any {
    return this.jwtHelper.decodeToken(rawToken);
  }
}
