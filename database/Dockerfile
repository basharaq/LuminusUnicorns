FROM mysql:5.7.28

ENV MYSQL_ROOT_PASSWORD 123
ENV MYSQL_DATABASE luminus  
ENV MYSQL_USER luminus  
ENV MYSQL_PASSWORD luminus

EXPOSE 3306

ADD setup.sql /docker-entrypoint-initdb.d
