import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { STORED_KEYS } from '../../constant/storedKeys';
import { UserDataResponse, UserData } from '../models/user/user-data.interface';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  errorMessage:WritableSignal<string> = signal<string>('')
  isLoading:WritableSignal<boolean> = signal<boolean>(false)
  flag:boolean =true

  loginForm: FormGroup = new FormGroup(
    {
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/)]),

    }
  );

  submitLoginForm():void{

    if(this.loginForm.valid){

      this.isLoading.set(true)
      this.authService.sendLoginData(this.loginForm.value).subscribe({
        next:(res: UserDataResponse) => {
          this.isLoading.set(false)
          
          // Handle successful login
          if(res.status === 'success' || res.message === 'success' || res.token){
            this.loginForm.reset()

            // Store token
            localStorage.setItem(STORED_KEYS.userToken, res.token)
            
            // Store user data if available
            if(res.user || res.data) {
              const userData = res.user || res.data;
              localStorage.setItem(STORED_KEYS.userData, JSON.stringify(userData))
            }
            
            // Decode and store user info
            this.authService.userDecodedToken();
            
            setTimeout(()=>{
              this.router.navigate(['/home'])
            },100);
          } else {
            this.errorMessage.set('Login failed. Please try again.')
          }
          
        },
        error:(err:HttpErrorResponse)=>{
          console.error('Login error:', err);
          this.errorMessage.set(err.error?.message || 'Login failed. Please check your credentials.')
          this.isLoading.set(false)

        }
      })
      
    }


    
  }

  togglesPasswordType():void{
    this.flag= !this.flag
  }
}
