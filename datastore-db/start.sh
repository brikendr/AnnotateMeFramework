#!/bin/sh

#Run the MySQL container, with a database named 'annotateMeDB' and credentials 
# for a annotateMe-service user which can access it.

echo "Starting DB...."

docker run --name db -d \
	-e MYSQL_ROOT_PASSWORD=112233AABBCC \
	-e MYSQL_DATABASE=annotateMeDB -e MYSQL_USER=annotateMe-service -e MYSQL_PASSWORD=112233AABBCC \
	-p 3306:3306 \
	mysql:latest

# Wait for the database service to start up
docker exec db mysqladmin --silent --wait=30 --uannotateMe-service -p112233AABBCC ping || exit 1

# Run the setup script.
echo "Setting up initial data...."
docker exec -i db mysql -uannotateMe-service -p112233AABBCC users < setup.sql
