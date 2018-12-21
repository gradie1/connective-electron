import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import { Observable } from 'rxjs';

import {Router} from '@angular/router';

import {User} from '../user';

import {MatSnackBar} from '@angular/material';

//Electron
import {ElectronService} from 'ngx-electron';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user:any;

  private UserClc: AngularFirestoreDocument<User>;
  userFire: Observable<User>;

  constructor(
    private auth: AngularFireAuth,
    private fs:AngularFirestore,
    private el: ElectronService,
    private snack: MatSnackBar,
    private router:Router
    ) { 

      this.auth.authState.subscribe(user => {
        if (user && user.uid) {
          console.log('user is logged in');
        } else {
          console.log('user not logged in');
        }
      });

      

    }

    get logged():boolean{

      this.auth.authState.subscribe(user => {
        if (user && user.uid) {
          console.log('user is logged in');
          return true;
        } else {
          console.log('user not logged in');
          return false;
        }
      });

      return false;

    }

    // Returns current user
    get currentUser(): any {
      this.user = this.user.user;
      return this.auth.user;
    }

    // Returns current user UID
    get currentUserId(): any {
      return this.user.uid;
    }

    signup(user){
      
      this.snack.open("Signing in..","ok",{duration:50000});

      console.log("logging");

      this.auth.auth.createUserWithEmailAndPassword(user.email,user.password)
      .then(usr=>{
        this.user = usr.user.uid;

        console.log("user signed");

        //Save the data to DB
        this.saveToFire(user,this.user);

      })
      .catch(error=>{
        this.snack.dismiss();
        this.el.remote.dialog.showErrorBox("Alert",error.message);
        console.log(error);
      });

    }

    saveToFire(user,uid){

      user.image = " ";

      //Init the user collection
      this.UserClc = this.fs.doc<User>('users/'+uid);

      this.UserClc.set(user)
      .then(res=>{

        console.log("data saved");
        this.snack.dismiss();

        this.router.navigateByUrl('/');

      })
      .catch(error=>{
        this.snack.dismiss();
        this.el.remote.dialog.showErrorBox("Alert",error.message);
        console.log(error);
      });

    }

    login(user){

      this.snack.open("logging in..","ok",{duration:50000});

      this.auth.auth.signInWithEmailAndPassword(user.email,user.password)
      .then(user=>{

        this.snack.dismiss();
        console.log("Loggedin");

        this.router.navigateByUrl('/');

      })
      .catch(error=>{
        this.snack.dismiss();
        this.el.remote.dialog.showErrorBox("Alert",error.message);
      });

    }

}
