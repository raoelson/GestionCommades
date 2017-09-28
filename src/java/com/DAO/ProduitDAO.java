/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.DAO;

import com.Model.Produit;
import java.util.List;

/**
 *
 * @author DjazzJah
 */
public interface ProduitDAO {
     List<Produit> ListAllProduit();

    void createProduit(Produit produit);

    void deleteProduit(String id);

    void updateProduit(Produit produit);

    String test_produit(String id);
}
