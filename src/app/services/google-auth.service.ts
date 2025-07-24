import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {

  userData: any = null;
  private clientId = environment.googleClientId;

  initGoogleSignIn(callbackFn: (res: any) => void) {
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: callbackFn,
      });

      google.accounts.id.renderButton(
        document.getElementById('googleBtn'),
        {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          width: '100%',
          text: 'continue_with'
        }
      );
    }
  }

  decodeJwt(token: string): any {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(
      decoded.split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join('')
    ));
  }
}
