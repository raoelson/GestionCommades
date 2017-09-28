/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.DAO;

import com.Model.Commande;
import java.util.List;

/**
 *
 * @author DjazzJah
 */
public interface FactureDAO {

    List ListFacture(String numeroclient);

    List chffreAffaire(String annee);

    List<Commande> getJson(String annee);

    List<Commande>ListAnnee();
    
}
