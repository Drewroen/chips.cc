import { UserInfo } from "./../models/userInfo";
import { Token } from "./../models/token";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<Token>("/login", { username, password });
  }

  getNewAccessToken() {
    return this.http.post<Token>("/token", {
      token: localStorage.getItem("refresh_token"),
    });
  }

  getInfo() {
    return this.http.get<UserInfo>("/info", {
      headers: new HttpHeaders().set(
        "Authorization",
        "Bearer " + localStorage.getItem("access_token")
      ),
    });
  }

  logout() {
    const options = {
      headers: null,
      body: {
        token: localStorage.getItem("refresh_token"),
      },
    };

    return this.http.delete("/logout", options);
  }
}
