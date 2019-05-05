import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

/**
 * Wrapper for HttpClient that injects Content-Type headers and a Authorization header if the user is authorized
 */
@Injectable()
export class HttpAuthClient {

    private apiUrl: string;

    constructor(
        private http: HttpClient, 
        private authService: AuthService,
        private router: Router
    ) {}

    /**
     * Sets the API prefix URL
     * @param apiUrl 
     */
    setApiUrl(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    /**
     * Executes a HTTP get request
     * @param url 
     * @param data 
     */
    get(url, data = null): Promise<Object> {
        let headers = new HttpHeaders();
        headers = this.createAuthorizationHeader(headers);

        return new Promise((resolve, reject) => {  
            this.http.get(this.prefixUrl(url), {
                headers: headers,
                params: data
            }).subscribe(
                data => resolve(data),
                err => this.catchError(err, reject)
            );
        });
    }

    /**
     * Executes a HTTP post request
     * @param url 
     * @param data 
     */
    post(url, data): Promise<Object> {
        let headers = new HttpHeaders();
        headers = this.createAuthorizationHeader(headers);

        return new Promise((resolve, reject) => {
            this.http.post(this.prefixUrl(url), data, {
                headers: headers
            }).subscribe(
                data => resolve(data),
                err => this.catchError(err, reject)
            );
        });
    }

    /**
     * Executes a HTTP post file upload
     * @param url 
     * @param data 
     */
    postFile(url, data): Promise<Object> {
        let headers = new HttpHeaders();
        headers = this.createAuthorizationHeader(headers);

        return new Promise((resolve, reject) => {
            this.http.post(this.prefixUrl(url), data, {
                headers: headers
            }).subscribe(
                data => resolve(data),
                err => this.catchError(err, reject)
            );
        });
    }

    /**
     * Executes a HTTP put request
     * @param url 
     * @param data 
     */
    put(url, data = null): Promise<Object> {
        let headers = new HttpHeaders();
        headers = this.createAuthorizationHeader(headers);

        return new Promise((resolve, reject) => {
            this.http.put(this.prefixUrl(url), data, {
                headers: headers
            }).subscribe(
                data => resolve(data),
                err => this.catchError(err, reject)
            );
        });
    }

    /**
     * Executes a HTTP delete request
     * @param url 
     */
    delete(url): Promise<Object> {
        let headers = new HttpHeaders();
        headers = this.createAuthorizationHeader(headers);

        return new Promise((resolve, reject) => {
            return this.http.delete(this.prefixUrl(url), {
                headers: headers
            }).subscribe(
                data => resolve(data),
                err => this.catchError(err, reject)
            );
        });
    }

    /**
     * Catches an HTTP error and checks if it's because of login permissions
     * @param error 
     * @param reject 
     */
    private catchError(error: any, reject: any): void {
        // In case of an authorization error, redirect the user to the login page
        if (error.status === 401) {
            this.authService.invalidateToken();
            this.router.navigate(["login"]);
            return;
        }

        reject(error);
    }

    /**
     * Applies the needed headers to the HTTP headers
     * 
     * @param headers 
     */
    private createAuthorizationHeader(headers: HttpHeaders) {
        if (this.authService.isAuthenticated()) { 
            headers = headers.append('Authorization', 'Bearer ' + this.authService.getToken()); 
        }

        headers = headers.append('Accept', 'application/json');

        return headers;
    }

    /**
     * Prefixes the URL with the API path
     * @param url 
     */
    private prefixUrl(url: string): string {
        return this.apiUrl + url;
    }
}