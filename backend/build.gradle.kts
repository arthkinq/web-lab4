plugins {
    id("java")
    id("war")
}

group = "ru.arf"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    // Jakarta EE 10 API (включает EJB, JPA, JAX-RS)
    compileOnly("jakarta.platform:jakarta.jakartaee-api:10.0.0")

    // Библиотека для токенов (JWT) - пригодится для авторизации
    implementation("io.jsonwebtoken:jjwt-api:0.11.5")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.11.5")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.11.5")
}

tasks.test {
    useJUnitPlatform()
}

tasks.war {
    archiveFileName.set("weblab4.war")
}

tasks.withType<JavaCompile> {
    options.encoding = "UTF-8"
}