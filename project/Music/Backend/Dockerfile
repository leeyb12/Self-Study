FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY . .
RUN chmod +x gradlew && ./gradlew clean bootJar -x test --no-daemon

FROM eclipse-temurin:21-jre
WORKDIR /app
ENV PORT=8080
ENV MUSIC_STORAGE_DIR=/data/music_storage
RUN mkdir -p /data/music_storage/board
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
