import {
  computed,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import {
  get,
  getDatabase,
  limitToFirst,
  limitToLast,
  orderByChild,
  push,
  query,
  ref,
  remove,
  set,
} from '@angular/fire/database';
import { Message } from 'src/app/core/models/message';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  auth = getAuth();
  db = getDatabase();

  messages: WritableSignal<Message[]> = signal([]);
  orderMessages: Signal<Message[]> = computed(() =>
    this.messages().sort((a: Message, b: Message) => a.date - b.date),
  );
  firstMessage?: Message;
  size = 10;

  addMessage(messageInput: Message): void {
    const _ref = push(ref(this.db, '/messages'));
    set(_ref, messageInput);

    //señales
    this.messages.update((_messages) => [..._messages, messageInput]);
  }

  deleteMessages() {
    remove(ref(this.db, '/messages'));
    //señales
    this.messages.set([]);
  }

  // getInitialMessage() {
  //   const messagesRef = query(
  //     ref(this.db, '/messages'),
  //     orderByChild('date'),
  //     limitToFirst(1),
  //   );

  //   get(messagesRef).then((snapshot) => {
  //     snapshot.forEach((childSnapshot) => {
  //       const message = childSnapshot.val();
  //       this.firstMessage = message;
  //     });
  //   });
  // }

  getLastMessages() {
    const messagesRef = query(
      ref(this.db, '/messages'),
      orderByChild('date'),
      limitToLast(this.size),
    );

    this.size += 10;

    get(messagesRef).then((snapshot) => {
      const emptyMessages: any = [];
      snapshot.forEach((childSnapshot) => {
        const message = childSnapshot.val();
        emptyMessages.push(message);
      });

      console.log({ emptyMessages });

      this.messages.update((_messages) => [..._messages, ...emptyMessages]);
    });
  }
}
