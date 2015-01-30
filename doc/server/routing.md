# Server Routing

*** 

## Contents

1. [Account](#1-account)

***

## 1. Session 

***

### 1.1 Creation

Flow for creating a session is as follows:

1. The user authenticates with a SSO and receives a code
2. The user sends a request to create a session including the code and the name of the SSO service
3. The server verifies the code with the SSO service
4. If the user does not have an account with the server, one is created
5. A session is created for the user

`POST /sessions`

__Sample request:__

```
{
  code: `SSO OAuth code`,
  provider: 'github'
}
```

[back to top](#contents)

***
