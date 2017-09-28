/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.DAO;

import com.Model.Client;
import com.Model.Commande;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import org.primefaces.json.JSONArray;
import org.primefaces.json.JSONException;
import org.primefaces.json.JSONObject;

/**
 *
 * @author DjazzJah
 */
public class NewMain {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        FactureDAO dao = new FactureImpl();
        //System.out.println(dao.chffreAffaire());
        System.out.println(dao.ListAnnee());
         Iterator it__ = dao.ListAnnee().iterator();
            while (it__.hasNext()) {
                Commande object = (Commande) it__.next();
                System.out.println(object.getAnnee());
            }
    }

}
