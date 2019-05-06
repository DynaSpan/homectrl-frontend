import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user/user.service';
import { UserDTO } from 'src/app/core/dto/UserDTO';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    private currentUser: UserDTO;

    constructor(
        private userService: UserService,
        private authService: AuthService,
        private router: Router
    ) {

        this.userService.getMe().subscribe(u => this.currentUser = u);
    }

    ngOnInit() {
    }

    logout() {
        this.authService.invalidateToken();
        this.router.navigate(["/login"]);
    }

}
