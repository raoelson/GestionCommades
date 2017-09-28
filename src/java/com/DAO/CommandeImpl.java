/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.DAO;

import com.Model.Client;
import com.Model.Commande;
import com.Model.Produit;
import com.Outil.HibernateUtil;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
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
public class CommandeImpl implements CommandeDAO {

    @Override
    public List<Commande> ListAllCommandes() {

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session session = sf.openSession();
        Transaction tr = null;
        Criteria query;
        List<Commande> commande = new ArrayList<Commande>();

        try {
            tr = session.beginTransaction();
            query = session.createCriteria(Commande.class);
            commande = query.list();
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

        return commande;
    }

    @Override
    public void createCommande(Commande cm) {
        SessionFactory sf = HibernateUtil.getSessionFactory();
        org.hibernate.Session session = sf.openSession();
        Transaction tr = null;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String dt = sdf.format(cm.getDatecommande()).toString();
        String annee = dt.substring(0, 4);
        Commande com = new Commande();
        Produit prod = (Produit) session.get(Produit.class, cm.getProduit().getNumproduit());
        Client client = (Client) session.get(Client.class, cm.getClient().getNumclient());
        //prod.setNumproduit(cm.getProduit().getNumproduit());       
        com.setId(cm.getId());
        com.setDatecommande(cm.getDatecommande());
        com.setQtecommande(cm.getQtecommande());
        com.setAnnee(annee);
        com.setProduit(prod);
        com.setClient(client);
        try {
            tr = session.beginTransaction();
            session.save(com);
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
    public void deleteCommande(int id) {
        SessionFactory sf = HibernateUtil.getSessionFactory();
        org.hibernate.Session session = sf.openSession();
        Transaction tr = null;

        try {
            tr = session.beginTransaction();
            Commande p = (Commande) session.get(Commande.class, id);
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
    public void updateCommande(Commande cm) {
        SessionFactory sf = HibernateUtil.getSessionFactory();
        org.hibernate.Session session = sf.openSession();
        Transaction tr = null;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String dt = sdf.format(cm.getDatecommande()).toString();
        String annee = dt.substring(0, 4);
        Produit prod = (Produit) session.get(Produit.class, cm.getProduit().getNumproduit());
        Client client = (Client) session.get(Client.class, cm.getClient().getNumclient());
        try {
            tr = session.beginTransaction();
            Commande cm_ = new Commande();
            cm_.setId(cm.getId());
            cm_.setQtecommande((cm.getQtecommande()));
            cm_.setDatecommande(cm.getDatecommande());
            cm_.setAnnee(annee);
            cm_.setProduit(prod);
            cm_.setClient(client);
            session.update(cm_);
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
    public List<Commande> ListAllSearch(Date debut, Date fin) {

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session session = sf.openSession();
        Transaction tr = null;
        Criteria query;
        List<Commande> commande = new ArrayList<Commande>();
        try {
            tr = session.beginTransaction();
            query = session.createCriteria(Commande.class)
                    .add(Restrictions.between("datecommande", debut, fin));
            commande = query.list();
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
        return commande;
    }

    @Override
    public Commande ListRecherche(String numeroclient) {
        Client client = new Client(numeroclient);
        Commande cm = new Commande();
        Integer qte, pu;
        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session session = sf.openSession();
        Transaction tr = null;
        Criteria query;

        try {
            tr = session.beginTransaction();
            query = session.createCriteria(Commande.class)
                    .add(Restrictions.eq("client", client));
            Iterator it = query.list().iterator();
            while (it.hasNext()) {
                Commande object = (Commande) it.next();
                pu = object.getProduit().getPuproduit().intValue();
                qte = object.getQtecommande().intValue();
                cm.setId(object.getId());
                cm.setDatecommande(object.getDatecommande());
                cm.setAnnee(object.getAnnee());
                cm.setProduit(object.getProduit());
                cm.setClient(object.getClient());

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
        return cm;
    }
}
