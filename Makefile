
up :
	docker-compose up --build

down:
	docker-compose down -v

clean: down
	docker system prune -af
	rm -f ~/data/users.sqlite3

re: clean up