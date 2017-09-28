/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.Controller;

import com.DAO.ProduitDAO;
import com.DAO.ProduitImpl;

import com.Model.Produit;
import java.awt.event.ActionEvent;
import java.io.Serializable;
import java.util.List;
import javax.faces.application.FacesMessage;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.RequestScoped;
import javax.faces.context.FacesContext;
import org.primefaces.event.SelectEvent;

/**
 *
 * @author DjazzJah
 */
@ManagedBean(name = "produitBean")
@RequestScoped
public class ProduitController implements Serializable {

    /**
     * Creates a new instance of ProduitController
     */
    ProduitDAO dao;
    private Produit produitSelected;
    private List<Produit> listProd;
    private Boolean desactived = true;

    public ProduitController() {
        produitSelected = new Produit();
    }

    public Produit getProduitSelected() {
        return produitSelected;
    }

    public void setProduitSelected(Produit produitSelected) {
        this.produitSelected = produitSelected;
    }

    public List<Produit> getListProd() {
        dao = new ProduitImpl();
        listProd = dao.ListAllProduit();
        return listProd;
    }

    public void setListProd(List<Produit> listProd) {
        this.listProd = listProd;
    }

    public Boolean getDesactived() {
        return desactived;
    }

    public void setDesactived(Boolean desactived) {
        this.desactived = desactived;
    }

    public void onRowSelect(SelectEvent event) {
        desactived = false;
    }

    public void suppression(String id) {
        dao = new ProduitImpl();
        dao.deleteProduit(id);
        FacesContext context = FacesContext.getCurrentInstance();
        context.addMessage(null, new FacesMessage("Produit supprimé"));
    }

    public void modification(ActionEvent actionEvent) {
        dao = new ProduitImpl();
        dao.updateProduit(produitSelected);
        FacesContext context = FacesContext.getCurrentInstance();
        context.addMessage(null, new FacesMessage("Produit mise à jour"));
    }

    public void ajout(ActionEvent actionEvent) {
        dao = new ProduitImpl();
        FacesContext context = FacesContext.getCurrentInstance();
        String rep = dao.test_produit(produitSelected.getNumproduit());
        if (rep.equalsIgnoreCase("not")) {
            dao.createProduit(produitSelected);
            context.addMessage(null, new FacesMessage("Produit ajouté"));
        } else {
            FacesMessage fm = new FacesMessage();
            fm.setSeverity(FacesMessage.SEVERITY_WARN);
            fm.setSummary("Numero produit deja pris");
            fm.setDetail("Saisi à nouveau");
            context.addMessage(null, fm);
        }
        produitSelected = new Produit();
    }
}
