COMPOSE = docker compose

SSLKEY   := $(HOME)/data/ssl-key.pem
SSLCERT  := $(HOME)/data/ssl-cert.pem
SSLCONF  := ./nginx/conf/ossl.conf

all: build-client gen-cert run

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

build:
	@$(COMPOSE) build

run: build
	@mkdir -p ~/data/avatars
	@$(COMPOSE) --parallel 4 -p agents up

clean:
	-@$(COMPOSE) rm -fsv `docker ps -aq`
	-@docker rmi `docker images -aq`

fclean: clean
	-@rm -f ~/data/*
	-@docker system prune -af

re: fclean run