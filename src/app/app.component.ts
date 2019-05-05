import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'HomeCTRL';

    constructor(private translate: TranslateService) {
        this.translate = translate;
        // this language will be used as a fallback when a translation isn't found in the current language
        this.translate.setDefaultLang('en');

        var localLang = localStorage.getItem('lang');

        if (localLang != null && localLang != undefined && (localLang == 'en' || localLang == 'nl')) {
            this.translate.use(localLang);
        } else {
            this.translate.use('en');
        }
    }
}
