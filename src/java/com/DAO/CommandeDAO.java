/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.DAO;

import com.Model.Commande;
import java.util.Date;
import java.util.List;

/**
 *
 * @author DjazzJah
 */
public interface CommandeDAO {
    List<Commande> ListAllCommandes();

    List<Commande> ListAllSearch(Date debut, Date fin);

    void createCommande(Commande cm);

    void deleteCommande(int id);

    void updateCommande(Commande cm);
    
     Commande ListRecherche(String numeroclient);
}
