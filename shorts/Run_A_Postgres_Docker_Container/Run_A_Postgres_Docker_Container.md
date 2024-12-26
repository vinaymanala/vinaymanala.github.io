# Run a postgres docker container

##### Date : November 16, 2024 | [#tech, #backend]()

Pull the postgres versioned or latest docker container from the docker hub registry

```shell
docker pull postgres:16.4
```

Create and run the container with port configuration

```shell
docker run -d --name sp -p 5432:5432 -e POSTGRES_PASSWORD=secret postgres:16.4
```

Finally interact the postgres db by executing the command:

```shell
docker exec -it sp psql -U postgres
```
