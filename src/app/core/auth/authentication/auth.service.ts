import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { UserData, UserDataResponse } from '../models/user/user-data.interface';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { STORED_KEYS } from '../../constant/storedKeys';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient)
  private readonly router = inject(Router)

  userDataDecoded:any=null;

  sendRegisterData(userData: object): Observable<UserDataResponse> {
    return this.httpClient.post<UserDataResponse>(environment.base_url + 'auth/signup', userData)
  }
  sendLoginData(userData: object): Observable<UserDataResponse> {
    return this.httpClient.post<UserDataResponse>(environment.base_url + 'auth/signin', userData)
  }

  userDecodedToken(): void {
    if(localStorage.getItem(STORED_KEYS.userToken)){
      this.userDataDecoded = jwtDecode(localStorage.getItem(STORED_KEYS.userToken)!);
  
      console.log(this.userDataDecoded,'user-data');
    }

  }

  userLogOut():void{
    localStorage.removeItem(STORED_KEYS.userToken);

    this.router.navigate(['/login'])


  }

}
