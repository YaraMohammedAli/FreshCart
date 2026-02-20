import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../authentication/auth.service';
import { subscribe } from 'diagnostics_channel';
import { error, log } from 'console';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {

  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  errorMessage:WritableSignal<string> = signal<string>('')
  isLoading:WritableSignal<boolean> = signal<boolean>(false)

  registerForm: FormGroup = new FormGroup(
    {
      name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(35)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/)]),
      rePassword: new FormControl(null, [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/)]),
      phone: new FormControl(null, [Validators.required, Validators.pattern(/^(\+20|0)?1[0125][0-9]{8}$/)]),

    },{
      validators: this.handleConfirmPassword
    }
  );
  handleConfirmPassword( group:AbstractControl){
    let password = group.get('password')?.value;
    let rePassword = group.get('rePassword')?.value;

    if(password === rePassword){
      return null;
    }else{
      return {mismatch:true};
    }


  }

  submitForm():void{

    if(this.registerForm.valid){

      this.isLoading.set(true)
      this.authService.sendRegisterData(this.registerForm.value).subscribe({
        next:(res)=> {
          if(res.message === 'success'){
            this.isLoading.set(false)
            this.registerForm.reset()
            setTimeout(()=>{
              this.router.navigate(['/login'])
            },100);

          }

        }
        ,
        error:(err:HttpErrorResponse)=>{
          this.errorMessage.set(err.error.message)
          this.isLoading.set(false)

        }
      })
      
    }


    
  }

}
