FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY . .
RUN chmod +x gradlew && ./gradlew clean bootJar -x test --no-daemon

FROM eclipse-temurin:21-jre
WORKDIR /app
ENV PORT=8080
ENV UPLOAD_DIR=/data/uploads
RUN mkdir -p /data/uploads
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
