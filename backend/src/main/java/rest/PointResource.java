package rest;

import jakarta.ejb.EJB;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import entities.User;
import entities.Result;
import rest.dto.PointRequest;
import services.ResultService;
import services.UserService;
import utils.JwtService;

import java.util.List;

@Path("/points")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PointResource {

    @EJB
    private ResultService resultService;

    @EJB
    private UserService userService; // Нам нужен метод поиска по имени (добавим его ниже!)

    @Inject
    private JwtService jwtService;

    // Вспомогательный метод для проверки токена
    private User getUserFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        String token = authHeader.substring(7);
        String username = jwtService.validateTokenAndGetUsername(token);
        if (username == null) return null;
        
        // Нам нужен метод findByUsername в UserService, давай его добавим позже
        // Пока используем хак - ищем через findUser с "фиктивным" паролем? Нет, лучше добавить метод.
        // Давай добавим метод в UserService прямо сейчас.
        // Предположим, он там есть: userService.findByUsername(username)
        return userService.findUserByUsername(username); 
    }

    @GET
    public Response getPoints(@HeaderParam("Authorization") String authHeader) {
        User user = getUserFromToken(authHeader);
        if (user == null) return Response.status(Response.Status.UNAUTHORIZED).build();

        List<Result> results = resultService.getUserResults(user);
        return Response.ok(results).build();
    }

    @POST
    public Response addPoint(PointRequest req, @HeaderParam("Authorization") String authHeader) {
        User user = getUserFromToken(authHeader);
        if (user == null) return Response.status(Response.Status.UNAUTHORIZED).build();

        if (req.getX() == null || req.getY() == null || req.getR() == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Coordinates required").build();
        }

        Result result = resultService.addResult(req.getX(), req.getY(), req.getR(), user);
        return Response.ok(result).build();
    }
    
    @DELETE
    public Response clear(@HeaderParam("Authorization") String authHeader) {
        User user = getUserFromToken(authHeader);
        if (user == null) return Response.status(Response.Status.UNAUTHORIZED).build();
        
        resultService.clearResults(user);
        return Response.ok().build();
    }
}