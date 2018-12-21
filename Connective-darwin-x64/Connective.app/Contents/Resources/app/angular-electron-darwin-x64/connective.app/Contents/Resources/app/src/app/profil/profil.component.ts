import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import {User} from '../user';
import {Router} from '@angular/router';

import {ElectronService} from 'ngx-electron';

import {AuthService} from '../core/auth.service';

import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  private userDoc: AngularFirestoreDocument<User>;
  user: Observable<User>;
  uid:string;

  private UserClc: AngularFirestoreDocument<User>;
  userFire: Observable<User>;

  constructor(
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
    private service: AuthService,
    private router: Router,
    private el: ElectronService,
    private storage:AngularFireStorage,
    private fs:AngularFirestore,
    private snack:MatSnackBar
  ) {

    this.auth.authState.subscribe(user => {
      if (user && user.uid) {

        this.uid = user.uid;
        this.getProfil(user.uid);

      } else {
        this.router.navigateByUrl('/login');
        console.log('user not logged in');
      }
    });

  

   }

   
  ngOnInit() {
  }

  getProfil(uid){

    this.snack.open("Loading..","ok",{duration:50000});

    this.userDoc = this.afs.doc<User>('users/'+uid);

    try{
      this.user = this.userDoc.valueChanges();
    }catch(error){
      this.snack.open(error.message,"ok",{duration:3000});
    }

    this.user.subscribe(d=>{
      this.snack.dismiss();
    });

  }

  getImage(){

    this.el.remote.dialog.showOpenDialog(
      this.el.remote.getCurrentWindow(),
      {
        filters: [
          {name: 'Images', extensions: ['png','jpg','gif','jpeg']}
        ]
      },
      (filepaths,bookmark)=>{
        console.log(filepaths);
        this.uploadImage(this.el.remote.require('fs').readFileSync(filepaths[0]));
      }
    );

  }

  uploadImage(file){

    this.snack.open("Uploading..","ok",{duration:50000});

    const ref = this.storage.ref('images/'+this.uid+'/profil.jpg');
    ref.put(file)
    .snapshotChanges()
    .pipe(
      finalize(() => {

        ref.getDownloadURL().subscribe(url=>{
          this.saveToDb(url);
        });

      

      } )
   )
  .subscribe()

  }

  saveToDb(url){

    console.log(url);

    const ref = this.storage.ref('images/');

    //Init the user collection
    this.UserClc = this.fs.doc<User>('users/'+this.uid);

    this.UserClc
    .update({image:url})
    .then(res=>{

      console.log("data saved");
      this.snack.dismiss();

    })
    .catch(error=>{
      this.snack.dismiss();
      this.el.remote.dialog.showErrorBox("Alert",error.message);
      console.log(error);
    });

  }

  logout(){
    this.auth.auth.signOut()
    .then(a=>{

      this.router.navigateByUrl('/login');

    })
    .catch(error=>{

    });
  }

}
