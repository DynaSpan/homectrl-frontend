import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
    public isAuthenticated(): boolean {
        var token = localStorage.getItem('token');

        return token != null && token != undefined;
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
        localStorage.setItem('token', token);
    }

    /**
     * Invalidates the current token
     */
    public invalidateToken() {
        localStorage.removeItem('token');
    }
}