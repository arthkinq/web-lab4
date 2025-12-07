package services;

import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import entities.User;
import utils.PasswordHasher;

import java.util.List;

@Stateless
public class UserService {

    @PersistenceContext(unitName = "lab4Unit")
    private EntityManager em;

    public boolean register(String username, String password) {
        // Проверяем, есть ли такой юзер
        List<User> existing = em.createQuery("SELECT u FROM User u WHERE u.username = :name", User.class)
                .setParameter("name", username)
                .getResultList();

        if (!existing.isEmpty()) {
            return false; // Пользователь уже есть
        }

        // Хэшируем пароль и сохраняем
        String hash = PasswordHasher.hash(password);
        User user = new User(username, hash);
        em.persist(user);
        return true;
    }

    public User findUser(String username, String password) {
        // Ищем пользователя по имени
        List<User> users = em.createQuery("SELECT u FROM User u WHERE u.username = :name", User.class)
                .setParameter("name", username)
                .getResultList();

        if (users.isEmpty()) return null;

        User user = users.get(0);
        // Проверяем пароль (сравниваем хэши)
        String inputHash = PasswordHasher.hash(password);

        if (user.getPassword().equals(inputHash)) {
            return user;
        }
        return null;
    }

    public User findUserByUsername(String username) {
        try {
            return em.createQuery("SELECT u FROM User u WHERE u.username = :name", User.class)
                    .setParameter("name", username)
                    .getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }
}