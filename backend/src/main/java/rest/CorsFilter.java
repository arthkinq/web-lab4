package rest;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.ext.Provider;
import java.io.IOException;

@Provider
public class CorsFilter implements ContainerResponseFilter {

    @Override
    public void filter(ContainerRequestContext requestContext, 
                       ContainerResponseContext responseContext) throws IOException {
        
        // Разрешаем запросы с любого источника (для разработки)
        // В проде лучше указывать конкретный адрес: "http://localhost:5173"
        responseContext.getHeaders().add(
            "Access-Control-Allow-Origin", "*");
            
        // Разрешаем заголовки (особенно Authorization для токена и Content-Type для JSON)
        responseContext.getHeaders().add(
            "Access-Control-Allow-Headers",
            "origin, content-type, accept, authorization");
            
        // Разрешаем методы
        responseContext.getHeaders().add(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, DELETE, OPTIONS, HEAD");
    }
}