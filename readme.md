POST /auth/signup : {
req : {email, password, first_name, last_name}
res : 201 : {message} || 409 : {message}
}

POST /auth/login : {
req : {email, password}
res : 200 : {success, next, message} || 401 : {message} || 403 : {message} || 400 : {message}
}

GET /auth/confirm : {
create component fiha resend link
}

#/api/me
