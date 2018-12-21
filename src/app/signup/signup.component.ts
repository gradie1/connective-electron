import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {AuthService} from '../core/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm : FormGroup

  genders = [{gender:'Male',value:'M'},{gender:'Female',value:'F'}];

  constructor(
    private authService:AuthService
  ) {

    this.signupForm = new FormGroup({
      firstName: new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(50)]),
      lastName: new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(50)]),
      email: new FormControl('',[Validators.required,Validators.email]),
      gender: new FormControl('',Validators.required),
      phone: new FormControl('',[Validators.required,Validators.pattern('^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$')]),
      password: new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(100)])
    });

   }

  ngOnInit() {
  }

  signup(){

    if(this.signupForm.valid){
      this.authService.signup(this.signupForm.value);
    }

  }

}
