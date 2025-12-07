package rest.dto;

import java.io.Serializable;

public class AuthRequest implements Serializable {
    private String login;
    private String password;

    // Геттеры и сеттеры
    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}