import {Injectable} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { HttpAuthClient } from '../auth/httpauthclient';
import { AuthService } from '../auth/auth.service';
import { UserDTO } from '../../dto/UserDTO';
import { LoginAuthTokenDTO } from '../../dto/LoginAuthTokenDTO';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    'providedIn': 'root'
})
export class UserService {

    private cachedUser: UserDTO;
    static userObservable: BehaviorSubject<UserDTO>;

    constructor(
        private http: HttpAuthClient, 
        private authService: AuthService,
        private translate: TranslateService
    ) {
        this.http.setApiUrl(environment.apiUrl + "user/");

        if (UserService.userObservable == null
            || UserService.userObservable == undefined) {
            UserService.userObservable = new BehaviorSubject<UserDTO>(null);
        }
    }

    /**
     * Gets the current user
     * 
     * @param forceUpdate If set to true, will force the service 
     *                    to get the latest user info from the server, 
     *                    otherwise a cached version is (probably) served
     * 
     * @return Promise with UserDTO object
     */
    getMe(forceUpdate: boolean = false): Promise<UserDTO> {
        return new Promise((resolve, reject) => {
            if (this.cachedUser != null && !forceUpdate) {
                return resolve(this.cachedUser);
            }

            this.http.get('me').then(result => {
                this.cachedUser = result as UserDTO;
                UserService.userObservable.next(this.cachedUser);

                switch (this.cachedUser.language) {
                    case 0:
                        this.translate.use('en'); 
                        localStorage.setItem('lang', 'en');
                        break;
                    case 1:
                        this.translate.use('nl'); 
                        localStorage.setItem('lang', 'nl');
                        break;
                }

                return resolve(this.cachedUser);
            }).catch (error => {
                return reject(error);
            });
        });
    } 

    /**
     * Gets an user
     * 
     * @return Promise with UserDTO object
     */
    get(userId: string): Promise<UserDTO> {
        return new Promise((resolve, reject) => {
            this.http.get(userId).then(res => {
                return resolve(res as UserDTO);
            }).catch (err => {
                return reject(err);
            });
        });
    }

    /**
     * Tries to login
     * @param username 
     * @param password 
     * 
     * @return Promise with boolean, true when succesful, reject otherwise
     */
    login(username: string, password: string): Promise<boolean> {
        let body = { "Username": username, "Password": password };
        
        return new Promise((resolve, reject) => {
            this.http.post('login', body).then(result => {
                var loginResult = result as LoginAuthTokenDTO;
        
                if (loginResult.token) {
                    this.authService.setToken(loginResult.token);

                    return resolve(true);
                }

                return reject();
            }).catch(err => {
                return reject(err);
            });
        });
    }

    /**
     * Changes the password of an user
     * @param oldPass 
     * @param newPass 
     * @param newPassRepeat 
     */
    changePassword(oldPass: string, newPass: string, newPassRepeat): Promise<boolean> {
        return new Promise((resolve, reject) => {
            // Check password requirements
            if (newPass.length < 10) return reject("COMMON.PASS_TOO_SHORT");
            if (newPass != newPassRepeat) return reject("COMMON.PASS_NO_MATCH");

            let body = { 
                "CurrentPassword": oldPass,
                "NewPassword": newPass
            };

            this.http.post('password', body).then(result => {
                return resolve(true);
            }).catch (err => {
                return reject(err);
            })
        })
    }
}