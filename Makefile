
up :
	docker-compose up --build -d

down:
	docker-compose down -v

clean: down
	docker system prune -af

re: clean up