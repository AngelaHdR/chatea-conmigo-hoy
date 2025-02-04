import { NgModule } from '@angular/core';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
    declarations: [HeaderComponent,FooterComponent],
    imports: [IonicModule],
    exports: [HeaderComponent,FooterComponent],
    providers: [],
})
export class SharedModule { }

