package services;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import entities.Result;
import entities.User;

import java.util.List;

@Stateless
public class ResultService {

    @PersistenceContext(unitName = "lab4Unit")
    private EntityManager em;

    @EJB
    private AreaCheckService areaCheckService;

    public Result addResult(double x, double y, double r, User user) {
        long startTime = System.nanoTime();
        boolean isHit = areaCheckService.checkHit(x, y, r);
        long executionTime = System.nanoTime() - startTime;

        Result result = new Result(x, y, r, isHit, executionTime, user);
        em.persist(result);
        return result;
    }

    public List<Result> getAllResults() {
        return em.createQuery("SELECT r FROM Result r ORDER BY r.id DESC", Result.class)
                .getResultList();
    }

    public void clearResults(User user) {
        em.createQuery("DELETE FROM Result r WHERE r.user.id = :userId")
                .setParameter("userId", user.getId())
                .executeUpdate();
    }
}