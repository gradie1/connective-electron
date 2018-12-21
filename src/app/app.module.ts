import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

//MD
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { SnackLoadComponent } from './snack-load/snack-load.component';

//electron
import {NgxElectronModule} from 'ngx-electron';

// Angular
import { environment } from '../environments/environment.prod';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { ChatComponent } from './chat/chat.component';
import { ProfilComponent } from './profil/profil.component';

const appRoutes: Routes = [
  {path:'',component:HomeComponent},
  {path:'login',component:LoginComponent},
  {path:'signup',component:SignupComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    SnackLoadComponent,
    ChatComponent,
    ProfilComponent
  ],
  imports: [
    BrowserModule,
    NgxElectronModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    AngularFireAuthModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule,

    //Routes configuration
    RouterModule.forRoot(
      appRoutes,
      {enableTracing:true}
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 

  

 }
