/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.DAO;

import com.Model.Client;
import com.Model.Commande;
import com.Outil.HibernateUtil;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import org.hibernate.Criteria;
import org.hibernate.FetchMode;
import org.hibernate.Hibernate;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.transform.AliasToBeanResultTransformer;
import org.hibernate.transform.Transformers;
import org.hibernate.type.Type;
import org.primefaces.json.JSONArray;
import org.primefaces.json.JSONException;
import org.primefaces.json.JSONObject;

/**
 *
 * @author DjazzJah
 */
public class FactureImpl implements FactureDAO {

    @Override
    public List<Commande> ListFacture(String numeroclient) {
        Client client = new Client(numeroclient);
        Commande cm = new Commande();
        Integer qte, pu;
        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session session = sf.openSession();
        Transaction tr = null;
        Criteria query;
        List<Commande> commande = new ArrayList<Commande>();
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
                commande.add(object);

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
        return commande;
    }

    @Override
    public List chffreAffaire(String annee) {
        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session session = sf.openSession();
        Transaction tr = null;
        Criteria query = null;
        List commande = new ArrayList();
        try {
            tr = session.beginTransaction();
            if (annee.equals("")) {
                query = session.createCriteria(Commande.class)
                        .addOrder(Order.asc("client.numclient"));
            }else{
                query = session.createCriteria(Commande.class)
                    .add(Restrictions.eq("annee", annee))
                    .addOrder(Order.asc("client.numclient"));
            }

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
    public List<Commande> getJson(String annee) {

        Iterator it = this.chffreAffaire(annee).iterator();
        List<Commande> resultat = new ArrayList<Commande>();
        String trouve = "";
        String reponses = "";
        int tr = 0;
        reponses = "[";
        int somme = 0;
        while (it.hasNext()) {
            Commande object = (Commande) it.next();
            if (trouve.equals(object.getClient().getNumclient())) {
                trouve = object.getClient().getNumclient();
                somme += (object.getProduit().getPuproduit()).intValue() * (object.getQtecommande()).intValue();
                tr = 1;
            } else if (!trouve.equals(object.getClient().getNumclient())) {
                if (tr != 0) {
                    reponses = reponses + somme;
                    reponses = reponses + "\"},";
                }
                reponses = reponses + "{\"id\":\"";
                reponses = reponses + object.getClient().getNumclient();
                reponses = reponses + "\",\"nom\":\"";
                reponses = reponses + object.getClient().getNomclient();
                reponses = reponses + "\",\"solde\":\"";
                somme = (object.getProduit().getPuproduit()).intValue() * (object.getQtecommande()).intValue();
                trouve = object.getClient().getNumclient();
            }
            if (it.hasNext() == false) {
                reponses = reponses + somme;
                reponses = reponses + "\"},";
            }
        }
        if (reponses.charAt(reponses.length() - 1) == ',') {
            reponses = reponses.substring(0, reponses.length() - 1);
        }
        reponses = reponses + "]";
        JSONArray jArray;
        try {
            jArray = new JSONArray(reponses);
            for (int i = 0; i < jArray.length(); i++) {
                JSONObject json_data = jArray.getJSONObject(i);
                resultat.add(new Commande(new Client(json_data.getString("id"), json_data.getString("nom")), Long.valueOf((Integer.toString(json_data.getInt("solde"))))));
            }
        } catch (JSONException ex) {
        }
        return resultat;
    }

    @Override
    public List<Commande> ListAnnee() {
        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session session = sf.openSession();
        Transaction tr = null;
        Criteria query;
        List commande = new ArrayList();
        try {
            tr = session.beginTransaction();
            query = session.createCriteria(Commande.class)
                    .addOrder(Order.desc("annee"));
            query.setProjection(Projections.projectionList()
                    .add(Projections.groupProperty("annee"))
                    .add(Projections.property("annee").as("annee"))
            );
            query.setResultTransformer(new AliasToBeanResultTransformer(Commande.class));
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
}

//            query.createCriteria("client");
//            query.createCriteria("produit");
//            query.setProjection(Projections.projectionList()
//                    .add(Projections.groupProperty("client.numclient"))
//                    .add(Projections.property("client").as("client"))
//                    .add(Projections.property("produit").as("produit"))
//            .add(Projections.sqlProjection("sum(qtecommande * qtecommande) as qtecommande", new String[]{"qtecommande"}, new Type[]{Hibernate.LONG}))
//            );
//            query.setResultTransformer(new AliasToBeanResultTransformer(Commande.class));
