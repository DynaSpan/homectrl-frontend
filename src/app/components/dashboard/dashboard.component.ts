import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user/user.service';
import { UserDTO } from 'src/app/core/dto/UserDTO';
import { TokenService } from 'src/app/core/services/auth/token.service';
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
        private tokenService: TokenService,
        private router: Router
    ) {

        this.userService.getMe().subscribe(u => this.currentUser = u);
    }

    ngOnInit() {
    }

    logout() {
        this.tokenService.invalidateToken();
        this.router.navigate(["/login"]);
    }

}
