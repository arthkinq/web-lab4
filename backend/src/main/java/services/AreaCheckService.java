package services;

import jakarta.ejb.Stateless;

@Stateless
public class AreaCheckService {

    public boolean checkHit(double x, double y, double r) {
        // 1-я четверть: Четверть круга радиусом R/2
        // Формула: x^2 + y^2 <= (R/2)^2
        if (x >= 0 && y >= 0) {
            return (x * x + y * y) <= (r / 2.0) * (r / 2.0);
        }

        // 2-я четверть: Прямоугольник
        // X от -R/2 до 0, Y от 0 до R
        if (x < 0 && y >= 0) {
            return (x >= -r / 2.0) && (y <= r);
        }

        // 4-я четверть: Треугольник
        // Вершины (0,0), (R,0), (0,-R).
        // Уравнение прямой через (R,0) и (0,-R): y = x - R  =>  y >= x - R
        if (x >= 0 && y < 0) {
            return y >= (x - r);
        }

        // 3-я четверть пустая
        return false;
    }
}
