package entities;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "results")
public class Result implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double x;
    private double y;
    private double r;
    private boolean hit;
    private LocalDateTime timestamp;
    private long executionTime;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Result() {}


    public Result(double x, double y, double r, boolean hit, long executionTime, User user) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.timestamp = LocalDateTime.now();
        this.executionTime = executionTime;
        this.user = user;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public double getX() { return x; }
    public void setX(double x) { this.x = x; }

    public double getY() { return y; }
    public void setY(double y) { this.y = y; }

    public double getR() { return r; }
    public void setR(double r) { this.r = r; }

    public boolean isHit() { return hit; }
    public void setHit(boolean hit) { this.hit = hit; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public long getExecutionTime() { return executionTime; }
    public void setExecutionTime(long executionTime) { this.executionTime = executionTime; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}