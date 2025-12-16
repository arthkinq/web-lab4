package services;

import jakarta.ejb.Singleton;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.sse.Sse;
import jakarta.ws.rs.sse.SseBroadcaster;
import jakarta.ws.rs.sse.SseEventSink;
import rest.dto.ResultResponse;
import entities.Result;

@Singleton
public class SseService {

    private SseBroadcaster broadcaster;

    public void register(SseEventSink eventSink, Sse sse) {
        if (broadcaster == null) {
            broadcaster = sse.newBroadcaster();
        }
        broadcaster.register(eventSink);
    }

    public void broadcastAdd(Result result, Sse sse) {
        if (broadcaster == null) return;

        ResultResponse dto = new ResultResponse(
                result.getId(), result.getX(), result.getY(), result.getR(),
                result.isHit(), result.getExecutionTime(), result.getTimestamp(),
                result.getUser().getUsername()
        );

        try {
            broadcaster.broadcast(sse.newEventBuilder()
                    .name("add")
                    .mediaType(MediaType.APPLICATION_JSON_TYPE)
                    .data(ResultResponse.class, dto)
                    .build());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void broadcastClear(String username, Sse sse) {
        if (broadcaster == null) return;

        try {
            broadcaster.broadcast(sse.newEventBuilder()
                    .name("clear") // Имя события
                    .mediaType(MediaType.TEXT_PLAIN_TYPE)
                    .data(String.class, username)
                    .build());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}