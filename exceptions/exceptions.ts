export class AccountNotFound extends Error
{
    constructor(m: string)
    {
        super(m);
        this.name = 'AccountNotFound'
    }
}

export class DynamoException extends Error
{
    constructor(m: string)
    {
        super(m);
        this.name = 'DynamoException'
    }
}

export class LoginFailure extends Error
{
    constructor(m: string)
    {
        super(m);
        this.name = 'LoginFailure'
    }
}

export class AccountAlreadyExists extends Error
{
    constructor(m: string)
    {
        super(m);
        this.name = 'AccountAlreadyExists'
    }
}

export class InvalidRefreshToken extends Error
{
    constructor(m: string)
    {
        super(m);
        this.name = 'InvalidRefreshToken'
    }
}

export class EmptyRefreshToken extends Error
{
    constructor(m: string)
    {
        super(m);
        this.name = 'EmptyRefreshToken'
    }
}