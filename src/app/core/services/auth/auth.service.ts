import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private tokenValid = false;
    private tokenInvalidated = false;

    public loggedInObservable = new Subject<boolean>();

    /**
     * Checks if the user is authenticated or not
     */
    public isAuthenticated(): boolean {
        if (this.tokenInvalidated) 
            return false;

        const token = this.getToken();

        this.tokenValid = (token !== null);

        if (this.tokenValid) 
            this.loggedInObservable.next(true);

        return this.tokenValid;
    }

    /**
     * Gets the current token
     */
    public getToken(): string {
        return localStorage.getItem('token');
    }

    /**
     * Sets the authentication token
     * @param token 
     */
    public setToken(token: string) {
        this.tokenInvalidated = false;
        this.loggedInObservable.next(true);
        localStorage.setItem('token', token);
    }

    /**
     * Invalidates the current token
     */
    public invalidateToken() {
        this.tokenValid = false;
        this.tokenInvalidated = true;
        this.loggedInObservable.next(false);
        localStorage.removeItem('token');
    }
}