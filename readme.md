# Auth module with mail confirmation

## Routes

### '/login' - login to account

#### body params: {email: string, password: string}

### '/logout' - logout from account

### '/registration' - register new user

#### body params: {email: string, password: string}

### '/refresh' - refresh access token

#### body params: {refreshToken: string} (from cookies)

### '/activate/:link' - activate your account with link on email after registration

#### body params: {activateLink: string}

### '/users' - get users list
