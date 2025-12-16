package rest;

import jakarta.ejb.EJB;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.sse.Sse;
import jakarta.ws.rs.sse.SseEventSink;
import entities.User;
import entities.Result;
import rest.dto.PointRequest;
import services.ResultService;
import services.UserService;
import services.SseService;
import utils.JwtService;

import java.util.List;

@Path("/points")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PointResource {

    @EJB
    private ResultService resultService;

    @EJB
    private UserService userService;

    @EJB
    private SseService sseService;

    @Inject
    private JwtService jwtService;

    @Context
    private Sse sse;

    private User getUserFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        String token = authHeader.substring(7);
        String username = jwtService.validateTokenAndGetUsername(token);
        if (username == null) return null;
        return userService.findUserByUsername(username);
    }

    @GET
    @Path("/stream")
    @Produces(MediaType.SERVER_SENT_EVENTS)
    public void listen(@Context SseEventSink eventSink) {
        sseService.register(eventSink, sse);
    }

    @GET
    public Response getPoints(@HeaderParam("Authorization") String authHeader) {
        User user = getUserFromToken(authHeader);
        if (user == null) return Response.status(Response.Status.UNAUTHORIZED).build();

        List<Result> results = resultService.getAllResults();
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
        sseService.broadcastAdd(result, sse);

        return Response.ok(result).build();
    }

    @DELETE
    public Response clear(@HeaderParam("Authorization") String authHeader) {
        User user = getUserFromToken(authHeader);
        if (user == null) return Response.status(Response.Status.UNAUTHORIZED).build();

        resultService.clearResults(user);
        sseService.broadcastClear(user.getUsername(), sse);
        return Response.ok().build();
    }
}