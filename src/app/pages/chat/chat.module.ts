import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatPageRoutingModule } from './chat-routing.module';

import { SharedModule } from 'src/app/shared/shared.module';
import { ChatPage } from './chat.page';
import { MessagesService } from 'src/app/shared/services/message.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ChatPage],
  providers: [MessagesService],
})
export class ChatPageModule {}
