package services;

import jakarta.ejb.Stateless;

@Stateless
public class AreaCheckService {

    public boolean checkHit(double x, double y, double r) {

        if (x >= 0 && y >= 0) {
            return (x * x + y * y) <= (r / 2.0) * (r / 2.0);
        }


        if (x < 0 && y >= 0) {
            return (x >= -r / 2.0) && (y <= r);
        }


        if (x >= 0 && y < 0) {
            return y >= (x - r);
        }


        return false;
    }
}
