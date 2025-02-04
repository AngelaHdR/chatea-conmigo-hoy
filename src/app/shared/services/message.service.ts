import { inject, Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { map, Observable } from 'rxjs';
import { Message } from 'src/app/core/models/message';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private readonly db = inject(AngularFireDatabase);

  private messagesDB!: AngularFireList<Message>;

  addMessage(messageInput: Message): void {
    this.messagesDB.push(messageInput);
  }

  deleteMessages() {
    this.messagesDB.remove();
  }

  getMessages(initialDate: string): Observable<Message[]> {
    this.messagesDB = this.db.list<Message>('/messages', (ref) =>
      ref.orderByChild('date').limitToFirst(10).startAfter(initialDate),
    );

    return this.messagesDB
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => this.getUserFromPayload(c.payload)),
        ),
      );
  }

  getUserFromPayload(payload: any): Message {
    return {
      ...payload.val(),
      $key: payload.key,
    };
  }
}
