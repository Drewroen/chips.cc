export class CreateAccountRequest
{
    public username: string;
    public password: string;
    public email: string;

    constructor(username: string, password: string, email: string = null)
    {
        this.username = username;
        this.password = password;
        this.email = email;
    }
}

export class UpdateAccountRequest
{
    public username: string;
    public password: string;
    public email: string;

    constructor(username: string, password: string, email: string = null)
    {
        this.username = username;
        this.password = password;
        this.email = email;
    }
}

export class LoginRequest
{
    public username: string;
    public password: string;

    constructor(username: string, password: string)
    {
        this.username = username;
        this.password = password;
    }
}

export class GetAccountInfoRequest
{
    public username: string;

    constructor(username: string)
    {
        this.username = username;
    }
}

export class UpdateTokenRequest
{
    public token: string;

    constructor(token: string)
    {
        this.token = token;
    }
}

export class LogoutRequest
{
    public username: string;

    constructor(username: string)
    {
        this.username = username;
    }
}