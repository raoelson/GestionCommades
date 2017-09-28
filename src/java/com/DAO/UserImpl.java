/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.DAO;

import com.Model.User;
import com.Outil.HibernateUtil;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author DjazzJah
 */
public class UserImpl implements UserDAO {

    @Override
    public void createUser(User user) {
       // throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
        SessionFactory sf = HibernateUtil.getSessionFactory();
        org.hibernate.Session session = sf.openSession();
        Transaction tr = null;

        try {
            tr = session.beginTransaction();
            session.save(user);
            session.flush();
            tr.commit();
        } catch (Exception e) {
            if (tr != null) {
                tr.rollback();
            }
        } finally {
            session.close();
        }
        sf.close();
    }

    @Override
    public void deleteUser(int id) {
        //throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session session = sf.openSession();
        Transaction tr = null;
        try {
            tr = session.beginTransaction();
            User user = (User) session.get(User.class, id);
            session.delete(user);
            session.flush();
            tr.commit();
        } catch (Exception e) {
            if (tr != null) {
                tr.rollback();
            }
        } finally {
            session.close();
        }
        sf.close();
    }

    @Override
    public void updateUser(User user) {
        //throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session session = sf.openSession();
        Transaction tr = null;
        try {
            tr = session.beginTransaction();
            User user_ = (User) session.get(User.class, user.getId());
            user_.setLogin(user.getLogin());
            user_.setPassword(user.getPassword());
            session.update(user_);
            session.flush();
            tr.commit();
        } catch (Exception e) {
            if (tr != null) {
                tr.rollback();
            }
        } finally {
            session.close();
        }
        sf.close();
    }

    @Override
    public List<User> ListAllUser() {
        SessionFactory sf = HibernateUtil.getSessionFactory();
        org.hibernate.Session session = sf.openSession();
        Transaction tr = null;
        List<User> user = new ArrayList<User>();
        try {
            tr = session.beginTransaction();
            Criteria query = session.createCriteria(User.class);
            user = query.list();
            session.flush();
            tr.commit();
        } catch (Exception e) {
            if (tr != null) {
                tr.rollback();
            }
        } finally {
            session.close();
        }
        sf.close();
        return user;
        // throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public String test_user(String id) {
        //throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
        String rep = "not";
        SessionFactory sf = HibernateUtil.getSessionFactory();
        org.hibernate.Session session = sf.openSession();
        Transaction tr = null;
        Criteria criteria;
        try {
            tr = session.beginTransaction();
            criteria = session.createCriteria(User.class)
                    .add(Restrictions.eq("login", id));
            criteria.list();
           // User user = (User) session.get(User.class, id);
            
            if (!(criteria.uniqueResult()).equals("")) {
                rep = "yes";
            }
            session.flush();
            tr.commit();
        } catch (Exception e) {
            if (tr != null) {
                tr.rollback();
            }
        } finally {
            session.close();
        }
        sf.close();
        return rep;
    }

    @Override
    public boolean verification(String login, String password) {
        //throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
       boolean rep = false;
        SessionFactory sf = HibernateUtil.getSessionFactory();
        org.hibernate.Session session = sf.openSession();
        Transaction tr = null;
        Criteria criteria;
        try {
            tr = session.beginTransaction();
            criteria = session.createCriteria(User.class)
                    .add(Restrictions.eq("login", login))
                    .add(Restrictions.eq("password", password));                                
            if (!(criteria.uniqueResult()).equals("")) {
                rep = true;
            }
            session.flush();
            tr.commit();
        } catch (Exception e) {
            if (tr != null) {
                tr.rollback();
            }
        } finally {
            session.close();
        }
        sf.close();
        return rep;
    }
    
}
