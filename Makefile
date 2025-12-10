
up :
	docker compose up --build

down:
	docker compose down -v

clean: down
	docker system prune -af
	rm -f ~/data/users.sqlite3

re: clean up

identity:
	docker compose build identity
	docker compose run identity

pong:
	docker compose down;
	docker image rm pong:pingpong;
	docker compose up;
