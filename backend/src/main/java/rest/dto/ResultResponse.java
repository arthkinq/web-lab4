package rest.dto;

import java.io.Serializable;
import java.time.LocalDateTime;

public class ResultResponse implements Serializable {
    private Long id;
    private double x;
    private double y;
    private double r;
    private boolean hit;
    private String executionTime;
    private String timestamp;
    private String username;

    public ResultResponse(Long id, double x, double y, double r, boolean hit, long executionTime, LocalDateTime timestamp, String username) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.executionTime = String.valueOf(executionTime);
        this.timestamp = timestamp.toString();
        this.username = username;
    }

    public Long getId() { return id; }
    public double getX() { return x; }
    public double getY() { return y; }
    public double getR() { return r; }
    public boolean isHit() { return hit; }
    public String getExecutionTime() { return executionTime; }
    public String getTimestamp() { return timestamp; }
    public String getUsername() { return username; }
}