/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.DAO;

import com.Model.Produit;
import com.Outil.HibernateUtil;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;

/**
 *
 * @author DjazzJah
 */
public class ProduitImpl implements ProduitDAO{
    
    @Override
    public List<Produit> ListAllProduit() {
        //throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
        SessionFactory sf = HibernateUtil.getSessionFactory();
        org.hibernate.Session session = sf.openSession();
        Transaction tr = null;
        List<Produit> produits = new ArrayList<Produit>();
        try {
            tr = session.beginTransaction();
            Query query = session.createQuery("from Produit p order by p.numproduit asc");
            produits = query.list();
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
        return produits;
    }

    @Override
    public void createProduit(Produit produit) {
        SessionFactory sf = HibernateUtil.getSessionFactory();
        org.hibernate.Session session = sf.openSession();
        Transaction tr = null;

        try {
            tr = session.beginTransaction();
            session.save(produit);
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
    public void deleteProduit(String id) {
        SessionFactory sf = HibernateUtil.getSessionFactory();
        org.hibernate.Session session = sf.openSession();
        Transaction tr = null;

        try {
            tr = session.beginTransaction();
            Produit p = (Produit) session.get(Produit.class, id);
            session.delete(p);
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
    public void updateProduit(Produit produit) {
        SessionFactory sf = HibernateUtil.getSessionFactory();
        org.hibernate.Session session = sf.openSession();
        Transaction tr = null;

        try {
            tr = session.beginTransaction();
            Produit pd = (Produit) session.get(Produit.class, produit.getNumproduit());
            pd.setDesignproduit(produit.getDesignproduit());
            pd.setPuproduit(produit.getPuproduit());
            session.update(pd);
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
    public String test_produit(String id) {
        String rep = "not";
        SessionFactory sf = HibernateUtil.getSessionFactory();
        org.hibernate.Session session = sf.openSession();
        Transaction tr = null;
        try {
            tr = session.beginTransaction();
            Produit produit = (Produit) session.get(Produit.class, id);
            if (!produit.equals("")) {
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

}
