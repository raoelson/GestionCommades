package com.Model;
// Generated 19 oct. 2015 12:59:09 by Hibernate Tools 3.6.0


import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

/**
 * Produit generated by hbm2java
 */
public class Produit  implements java.io.Serializable {


     private String numproduit;
     private String designproduit;
     private BigDecimal puproduit;
     private Set commandes = new HashSet(0);

    public Produit() {
    }

	
    public Produit(String numproduit, String designproduit, BigDecimal puproduit) {
        this.numproduit = numproduit;
        this.designproduit = designproduit;
        this.puproduit = puproduit;
    }
    public Produit(String numproduit, String designproduit, BigDecimal puproduit, Set commandes) {
       this.numproduit = numproduit;
       this.designproduit = designproduit;
       this.puproduit = puproduit;
       this.commandes = commandes;
    }
   
    public String getNumproduit() {
        return this.numproduit;
    }
    
    public void setNumproduit(String numproduit) {
        this.numproduit = numproduit;
    }
    public String getDesignproduit() {
        return this.designproduit;
    }
    
    public void setDesignproduit(String designproduit) {
        this.designproduit = designproduit;
    }
    public BigDecimal getPuproduit() {
        return this.puproduit;
    }
    
    public void setPuproduit(BigDecimal puproduit) {
        this.puproduit = puproduit;
    }
    public Set getCommandes() {
        return this.commandes;
    }
    
    public void setCommandes(Set commandes) {
        this.commandes = commandes;
    }




}

