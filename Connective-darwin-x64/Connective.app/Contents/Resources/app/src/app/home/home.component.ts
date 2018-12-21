import { Component, OnInit, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { pipe } from 'rxjs'; 
import { map, filter } from 'rxjs/operators';

import {User} from '../user';
import { database } from 'firebase';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private userClc: AngularFirestoreCollection<User>;
  users: Observable<User[]>;
  messages: Observable<User[]>;

  search:string = "";

  userId:string ;
  currentUserId:string;

  constructor(
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
  ) { 

    this.auth.authState.subscribe(user => {
      if (user && user.uid) {

        this.currentUserId = user.uid;

        this.getUsers();

      } else {
        console.log('user not logged in');
      }

    });

  }

  ngOnInit() {
  }

  getUsers(){

    this.userClc = this.afs.collection<User>('/users');
    this.users = this.userClc.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() ;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

  }

  filterUsers(){

    this.userClc = this.afs.collection<User>('/users');
    this.users = this.userClc.valueChanges()
    .pipe(
        map(items => items.filter(item => item.firstName.toLowerCase().includes(this.search.toLowerCase() ) ))
    )

  }

  getMessages(){
    let m = this.afs.collection<User>('users/');
    this.messages = m.valueChanges();
  }


  loadChat(id){
    this.userId = id;
  }

}
