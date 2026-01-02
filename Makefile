COMPOSE = docker compose --parallel 4 -p agents

SSLKEY   := $(HOME)/data/ssl-key.pem
SSLCERT  := $(HOME)/data/ssl-cert.pem
SSLCONF  := ./nginx/conf/ossl.conf

all: build-client gen-cert up

build-client:
	npm ci --prefix ./client
	npm run build --prefix ./client

gen-cert:
	@mkdir -p $(dir $(SSLKEY))
	@if [ ! -f "$(SSLKEY)" ]; then \
		openssl genpkey -algorithm RSA -out "$(SSLKEY)"; \
	fi
	@if [ ! -f "$(SSLCERT)" ]; then \
		openssl req -x509 -noenc \
			-key "$(SSLKEY)" \
			-config "$(SSLCONF)" \
			-new -out "$(SSLCERT)"; \
	fi


up :
	mkdir -p ~/data/avatars
	$(COMPOSE) up --build

down:
	$(COMPOSE) down -v

clean: down
	docker image prune -af
	rm -f ~/data/users.sqlite3
	rm -f ~/data/chess.sqlite3

re: clean up

identity:
	$(COMPOSE) build identity
	$(COMPOSE) run identity

pong:
	$(COMPOSE) down;
	docker image rm pong:pingpong;
	$(COMPOSE) up;

nginx:
	$(COMPOSE) down;
	docker image rm nginx:pingpong;
	$(COMPOSE) up;

notification:
	$(COMPOSE) down;
	docker image rm notification:pingpong;
	$(COMPOSE) up;

