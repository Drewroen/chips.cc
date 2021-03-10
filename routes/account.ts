import * as express from 'express';
import * as AWS from 'aws-sdk';
import * as cors from 'cors';
import * as bodyparser from 'body-parser';
import { Jwt } from '../static/jwt/jwt';
import { DynamoService } from './../services/dynamo/dynamoService';
import { CreateAccountRequest, GetAccountInfoRequest, LoginRequest, LogoutRequest, UpdateAccountRequest, UpdateTokenRequest } from './../services/dynamo/objects/dynamoServiceObjects';
import { AccountAlreadyExists, AccountNotFound, EmptyRefreshToken, InvalidRefreshToken, LoginFailure } from '../exceptions/exceptions';

const router = express.Router();

router.use(bodyparser.json());
router.use(cors({
    origin: true,
    credentials: true
}));

AWS.config.update({
    region: 'us-east-2',
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const dynamoService = new DynamoService(dynamoDb);

router.post('/login', async function (req, res) {
    const body = req.body;
    const loginRequest: LoginRequest = new LoginRequest(body.username, body.password);
    try {
        const response = await dynamoService.login(loginRequest);
        res.status(201).json(response);
    } catch (err) {
        if (err instanceof LoginFailure)
            res.status(401).send(err.message);
        else if (err instanceof AccountNotFound)
            res.status(403).send(err.message);
        else
            res.status(500).send(err.message);
    }
});

router.post('/account', async function (req, res) {
    const body = req.body;
    const createAccountRequest: CreateAccountRequest = new CreateAccountRequest(body.username, body.password, body.email);
    try {
        await dynamoService.createAccount(createAccountRequest);
        res.status(201).send();
    } catch (err) {
        if (err instanceof AccountAlreadyExists)
            res.status(400).send(err.message);
        else
            res.status(500).send(err.message);
    }
});

router.get('/info', Jwt.authenticateToken, async function (req, res) {
    const getAccountInfoRequest = new GetAccountInfoRequest((req as any).user.username);
    try {
        const response = await dynamoService.getAccountInfo(getAccountInfoRequest);
        res.status(200).json(response);
    } catch (err) {
        if (err instanceof AccountNotFound)
            res.status(403).send(err.message);
        else
            res.status(500).send(err.message);
    }
});

router.post('/token', async function (req, res) {
    const updateTokenRequest = new UpdateTokenRequest(req.body.token);
    try {
        const response = await dynamoService.updateRefreshToken(updateTokenRequest);
        res.status(200).json(response);
    } catch (err) {
        if (err instanceof EmptyRefreshToken)
            res.status(401).send(err.message);
        else if (err instanceof InvalidRefreshToken)
            res.status(403).send(err.message);
        else
            res.status(500).send(err.message);
    }
});

router.delete('/logout', Jwt.authenticateToken, async function (req, res) {
    const logoutRequest = new LogoutRequest((req as any).user.username);
    try {
        await dynamoService.logout(logoutRequest);
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;