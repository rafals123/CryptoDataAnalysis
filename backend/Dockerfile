FROM maven:3.8.4-openjdk-17 AS build

WORKDIR /usr/app

COPY . .

RUN mvn clean package -DskipTests

FROM openjdk:17

WORKDIR /srv/crypto

COPY --from=build /usr/app/target/*.jar ./server.jar

EXPOSE 8080

CMD ["java","-jar","./server.jar"]