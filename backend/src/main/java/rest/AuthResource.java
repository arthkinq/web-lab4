package rest;

import jakarta.ejb.EJB;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import entities.User;
import rest.dto.AuthRequest;
import rest.dto.TokenResponse;
import services.UserService;
import utils.JwtService;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8")
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    @EJB
    private UserService userService;

    @Inject
    private JwtService jwtService;

    @POST
    @Path("/login")
    public Response login(AuthRequest request) {
        User user = userService.findUser(request.getLogin(), request.getPassword());
        if (user != null) {
            String token = jwtService.generateToken(user.getUsername());
            return Response.ok(new TokenResponse(token)).build();
        }
        return Response.status(Response.Status.UNAUTHORIZED).entity("Неверный логин или пароль").build();
    }

    @POST
    @Path("/register")
    public Response register(AuthRequest request) {
        if (request.getLogin() == null || request.getPassword() == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Логин и пароль обязательны").build();
        }
        boolean created = userService.register(request.getLogin(), request.getPassword());

        if (created) {
            String token = jwtService.generateToken(request.getLogin());
            return Response.ok(new TokenResponse(token)).build();
        }
        return Response.status(Response.Status.CONFLICT).entity("Пользователь уже существует").build();
    }
}