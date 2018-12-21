import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {AuthService} from '../core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm : FormGroup

  constructor(
    private auth:AuthService
  ) { 

    this.loginForm = new FormGroup({
      email: new FormControl('',[Validators.required,Validators.email]),
      password: new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(100)])
    });

  }

  ngOnInit() {
  }

  login(){
    if(this.loginForm.valid){
      this.auth.login(this.loginForm.value);
    }
  }

}
