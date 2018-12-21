import { Component, OnInit, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';

import {MatSnackBar} from '@angular/material';

import {User} from '../user';
import { setContextDirty } from '@angular/core/src/render3/styling';

import {Subject} from 'rxjs';

import {ElectronService} from 'ngx-electron';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @Input() sentId;

  private userDoc: AngularFirestoreDocument<User>;
  user: Observable<User>;

  uid:string;

  message:string = null;

  messages:Observable<any>;

  receiverId:string;

  sender:Observable<User>;
  senderName:string = "Chat";

  currentUserImage:string;

  constructor(
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
    private el: ElectronService,
    private snack: MatSnackBar
  ) { 

    

    this.auth.authState.subscribe(user => {
      if (user && user.uid) {

        this.uid = user.uid;

        this.getProfil(user.uid);

      } else {
        console.log('user not logged in');
      }

    });

  }

  ngOnInit() {
    
  }

  ngOnChanges(){

    this.receiverId = this.sentId;

    //Get messages
    this.loadMessages();

    //Get the sender
    this.getSender();

    setTimeout(()=>{
      //Scroll bottom
      this.scrollBottom();
    },20);

    console.log(this.sentId);


  }

  loadMessages(){

    const size$ = new Subject<string>();
    const queryObservable = size$.pipe(
      switchMap(size => 
        this.messages = this.afs.collection('messages', ref => ref.orderBy("date")).valueChanges()
      )
    );

    // subscribe to changes
    queryObservable.subscribe(queriedItems => {
      console.log(queriedItems);  
    });

    // trigger the query
    size$.next('large');

  }

  getProfil(uid){

    this.userDoc = this.afs.doc<User>('users/'+uid);
    this.user = this.userDoc.valueChanges();

    this.user.subscribe(val=>{
      this.currentUserImage = val.image;
    });

  }

  getSenderName(name){
    return name;
  }

  sendMessage(){

    if(this.message != null){

      this.snack.open("Sending..","",{duration:2000});

      let msg = this.message;
      
      this.message = "";

      //Send message to the selected user
      this.afs.collection<any>('messages')
      .add({
        sender:this.uid,
        receiverId: this.receiverId,
        message:msg,
        date:new Date()
      })
      .then(res=>{
        //Scroll bottom
        this.scrollBottom();
        console.log("message sent");
        this.snack.dismiss();
      })
      .catch(error=>{
        this.snack.dismiss();
        console.log(error);
        this.el.remote.dialog.showErrorBox("Alert",error.message);
      });


    }

  }

  getSender(){
    this.userDoc = this.afs.doc<User>('users/'+this.sentId);
    this.sender = this.userDoc.valueChanges();
    this.sender.subscribe(v=>{
      this.senderName = v.firstName;
    });
  }

  getTime(date){
    let d = date.toDate();
    let h = d.getHours() < 10 ? "0"+d.getHours() : d.getHours();
    let m = d.getMinutes() < 10 ? "0"+d.getMinutes() : d.getMinutes();
    return date = h+":"+m;
  }

  scrollBottom(){
    let field = document.getElementById('messages');
    let val = field.scrollHeight;
    field.scrollTop = val;
  }

}
