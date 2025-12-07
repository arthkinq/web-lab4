package services;

import jakarta.ejb.Stateless;

@Stateless
public class AreaCheckService {

    public boolean checkHit(double x, double y, double r) {
        // 1-я четверть: Четверть круга
        if (x >= 0 && y >= 0) {
            return (x * x + y * y) <= (r * r);
        }

        // 2-я четверть: Треугольник
        if (x < 0 && y >= 0) {
            // y <= 2x + r (из лаб 3)
            return y <= (2 * x + r);
        }

        // 4-я четверть: Прямоугольник
        if (x >= 0 && y < 0) {
            return (x <= r / 2) && (y >= -r);
        }

        return false;
    }
}