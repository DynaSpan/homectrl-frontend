import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user/user.service';
import { TranslateService } from '@ngx-translate/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

    /**
     * State
     */
    loginError: string = "";
    loginState: string = "ready"

    constructor(
        private router: Router,
        private translate: TranslateService,
        private userService: UserService,
    ) { }

    onLoginSubmit(form: NgForm) {
        this.loginState = "executing";

        this.userService.login(form.value.username, form.value.password).then(res => {
            if (res) {
                this.router.navigate(["/"]);
            }
        }).catch(err => { 
            var errMessage;
            this.loginState = 'ready';

            if (err.error != undefined && err.error.message != undefined) {
                errMessage = "LOGIN." + err.error.message;
                this.translate.get(errMessage).subscribe(txt => this.loginError = txt);
            } else { 
                this.loginError = "An unexpected error occurred"
            }
        });
    }

    setLanguage(lang: string) {
        localStorage.setItem('lang', lang);
        this.translate.use(lang);
    }
}
