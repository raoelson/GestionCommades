/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.Controller;

import com.DAO.SessionBean;
import com.DAO.UserDAO;
import com.DAO.UserImpl;
import com.DAO.back_restore;
import com.Model.User;
import java.awt.event.ActionEvent;
import java.io.IOException;
import java.io.Serializable;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.faces.application.FacesMessage;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.RequestScoped;
import javax.faces.bean.SessionScoped;
import javax.faces.context.FacesContext;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;
import org.primefaces.event.SelectEvent;

/**
 *
 * @author DjazzJah
 */
@ManagedBean(name = "userBean")
@RequestScoped
@SessionScoped
public class UserController implements Serializable {

    UserDAO dao;
    List<User> userList;
    User userSelected;
    private Boolean desactived = true;
    private String login_, password_;

    public UserController() {
//       
        userSelected = new User();
    }

    public Boolean isDesactived() {
        return desactived;
    }

    public void setDesactived(Boolean desactived) {
        this.desactived = desactived;
    }

    public String getLogin_() {
        return login_;
    }

    public void setLogin_(String login_) {
        this.login_ = login_;
    }

    public String getPassword_() {
        return password_;
    }

    public void setPassword_(String password_) {
        this.password_ = password_;
    }

    public List<User> getUserList() {
        dao = new UserImpl();
        userList = dao.ListAllUser();
        return userList;
    }

    public void setUserList(List<User> userList) {
        this.userList = userList;
    }

    public User getUserSelected() {
        return userSelected;
    }

    public void setUserSelected(User userSelected) {
        this.userSelected = userSelected;
    }

    public void onRowSelect(SelectEvent event) {
        desactived = false;
    }

    public void suppression(int id) {
        dao = new UserImpl();
        dao.deleteUser(id);
        FacesContext context = FacesContext.getCurrentInstance();
        context.addMessage(null, new FacesMessage("User supprimé"));
    }

    public void modification(ActionEvent actionEvent) {
        dao = new UserImpl();
        User user_modf = new User();
        user_modf.setId(userSelected.getId());
        user_modf.setLogin(userSelected.getLogin());
        user_modf.setPassword(SHAConverter(userSelected.getPassword()));
        dao.updateUser(user_modf);
        FacesContext context = FacesContext.getCurrentInstance();
        context.addMessage(null, new FacesMessage("User mise à jour"));
    }

    public void ajout(ActionEvent actionEvent) {

        dao = new UserImpl();
        FacesContext context = FacesContext.getCurrentInstance();
        String rep = dao.test_user(userSelected.getLogin());
        if (rep.equalsIgnoreCase("not")) {
            User user_ajout = new User();
            user_ajout.setLogin(userSelected.getLogin());
            user_ajout.setPassword(SHAConverter(userSelected.getPassword()));
            dao.createUser(user_ajout);
            context.addMessage(null, new FacesMessage("User ajouté"));
        } else {
            FacesMessage fm = new FacesMessage();
            fm.setSeverity(FacesMessage.SEVERITY_WARN);
            fm.setSummary("Login user deja pris");
            fm.setDetail("Saisi à nouveau");
            context.addMessage(null, fm);
        }
        userSelected = new User();
    }

    back_restore br;
    private String nom_base;
   
    public String getNom_base() {
        return nom_base = "gestionscommandes";
    }

    public void setNom_base(String nom_base) {
        this.nom_base = nom_base;
    }

    public void back() {
        br = new back_restore();
        this.br.sauveBase(this.getNom_base());
        FacesContext context = FacesContext.getCurrentInstance();
        context.addMessage(null, new FacesMessage("Sauvegarde avec succes"));
    }

    public String dateTime() {
        DateFormat dateFormat = new SimpleDateFormat("yyyy_MM_dd_HH_mm_ss");
        Calendar cal = Calendar.getInstance();
        return dateFormat.format(cal.getTime());
    }

   

    public String SHAConverter(String password) {
        try {
            MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
            byte[] hash = messageDigest.digest(password.getBytes("UTF-8"));
            StringBuilder stringBuilder = new StringBuilder();
            for (int i = 0; i < hash.length; i++) {
                stringBuilder.append(Integer.toString((hash[i] & 0xff) + 0x100, 16).substring(1));
            }
            return stringBuilder.toString();
        } catch (NoSuchAlgorithmException ex) {
            Logger.getLogger(UserController.class.getName()).log(Level.SEVERE, null, ex);
            return "";
        } catch (UnsupportedEncodingException unsupportedEncodingException) {
            Logger.getLogger(UserController.class.getName()).log(Level.SEVERE, null, "SHAConverter.getAsObject:" + unsupportedEncodingException);
            return "";
        }
    }

    public String validateUsernamePassword() {
        dao = new UserImpl();
        boolean valid = dao.verification(login_, SHAConverter(password_));
        if (valid) {
            HttpSession session = SessionBean.getSession();
            session.setAttribute("username", login_);
            return "client";
        } else {
            FacesContext.getCurrentInstance().addMessage(
                    null,
                    new FacesMessage(FacesMessage.SEVERITY_WARN,
                            "Incorrect Username and Passowrd",
                            "Please enter correct username and Password"));
            return "login";
        }
    }

    public String logout() {
        HttpSession session = SessionBean.getSession();
        session.invalidate();
        return "/login.xhtml?faces-redirect=true";
    }
}
