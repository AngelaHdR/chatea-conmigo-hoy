import { Injectable, signal, WritableSignal } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import {
  get,
  getDatabase,
  limitToFirst,
  orderByChild,
  push,
  query,
  ref,
  remove,
  set,
  startAt,
} from '@angular/fire/database';
import { Message } from 'src/app/core/models/message';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  auth = getAuth();
  db = getDatabase();

  messages: WritableSignal<any> = signal([]);

  addMessage(messageInput: Message): void {
    const _ref = push(ref(this.db, '/messages'));
    set(_ref, messageInput);

    this.messages.update((_messages) => [..._messages, messageInput]);
  }

  deleteMessages() {
    remove(ref(this.db, '/messages'));
    this.messages.set([]);
  }

  getMessages(start = 0) {
    const messagesRef = query(
      ref(this.db, '/messages'),
      orderByChild('date'),
      limitToFirst(10),
      startAt(start),
    );

    get(messagesRef).then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const message = childSnapshot.val();
        this.messages.update((_messages) => [
          ..._messages,
          {
            key: childSnapshot.key,
            ...message,
          },
        ]);
      });
    });
  }
}
