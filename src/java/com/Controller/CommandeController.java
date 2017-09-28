/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.Controller;

import com.DAO.CommandeDAO;
import com.DAO.CommandeImpl;

import com.Model.Commande;
import java.awt.event.ActionEvent;
import java.util.ArrayList;
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
@ManagedBean(name = "commandeBean")
@RequestScoped
public class CommandeController {

    /**
     * Creates a new instance of CommandeController
     */
    CommandeDAO dao;
    private Commande commandeSelected;
    private List<Commande> listCm;
    private Boolean desactived = true;

    public CommandeController() {
        commandeSelected = new Commande();
    }

    public Commande getCommandeSelected() {
        return commandeSelected;
    }

    public void setCommandeSelected(Commande commandeSelected) {
        this.commandeSelected = commandeSelected;
    }

    public List<Commande> getListCm() {
        dao = new CommandeImpl();
        listCm = dao.ListAllCommandes();
        return listCm;
    }

    public void setListCm(List<Commande> listCm) {
        this.listCm = listCm;
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

    public void suppression(int id) {
        dao = new CommandeImpl();
        dao.deleteCommande(id);
        FacesContext context = FacesContext.getCurrentInstance();
        context.addMessage(null, new FacesMessage("Commande supprimé"));
    }

    public void modification_() {
        dao = new CommandeImpl();
        dao.updateCommande(commandeSelected);
        FacesContext context = FacesContext.getCurrentInstance();
        context.addMessage(null, new FacesMessage("Mise à jour avec succes"));
    }

    public void ajout(ActionEvent actionEvent) {
        dao = new CommandeImpl();
        FacesContext context = FacesContext.getCurrentInstance();
        dao.createCommande(commandeSelected);
        context.addMessage(null, new FacesMessage("Commande ajouté"));
        commandeSelected = new Commande();
    }

    public List search2date() {
        List<Commande> listcm_ = new ArrayList<Commande>();
        dao = new CommandeImpl();   
        listcm_ = dao.ListAllSearch(commandeSelected.getDebut(), commandeSelected.getFin());        
        return listcm_;
    }       
}
