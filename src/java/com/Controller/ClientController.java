/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.Controller;

import com.DAO.ClientDAO;
import com.DAO.ClientImpl;

import com.Model.Client;
import java.awt.event.ActionEvent;
import java.io.Serializable;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;
import javax.faces.application.FacesMessage;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.RequestScoped;
import javax.faces.context.FacesContext;
import org.primefaces.event.SelectEvent;

import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;

/**
 *
 * @author DjazzJah
 */
@ManagedBean(name = "clientBean")
@RequestScoped
public class ClientController implements Serializable {

    /**
     * Creates a new instance of ClientController
     */
    ClientDAO dao;
    private Client clientSelected;
    private List<Client> listclient;
    private Boolean desactived = true;

    public ClientController() {
        clientSelected = new Client();
    }

    public Client getClientSelected() {
        return clientSelected;
    }

    public void setClientSelected(Client clientSelected) {
        this.clientSelected = clientSelected;
    }

    public List<Client> getListclient() {
        dao = new ClientImpl();
        listclient = dao.getListAll();
        return listclient;
    }

    public void setListclient(List<Client> listclient) {
        this.listclient = listclient;
    }

    public String dateTime() {
        DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        Calendar cal = Calendar.getInstance();
        return dateFormat.format(cal.getTime());
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
        dao = new ClientImpl();
        dao.deleteClient(id);
        FacesContext context = FacesContext.getCurrentInstance();
        context.addMessage(null, new FacesMessage("Client supprimé"));
    }

    public void modification(ActionEvent actionEvent) {
        dao = new ClientImpl();
        dao.updateClient(clientSelected);
        FacesContext context = FacesContext.getCurrentInstance();
        context.addMessage(null, new FacesMessage("Client mise à jour"));
    }

    public void ajout(ActionEvent actionEvent) {
        dao = new ClientImpl();
        FacesContext context = FacesContext.getCurrentInstance();
        String rep = dao.test_client(clientSelected.getNumclient());
        if (rep.equalsIgnoreCase("not")) {
            dao.createClient(clientSelected);
            context.addMessage(null, new FacesMessage("Client ajouté"));
        } else {
            FacesMessage fm = new FacesMessage();
            fm.setSeverity(FacesMessage.SEVERITY_WARN);
            fm.setSummary("Numero deja pris");
            fm.setDetail("Saisi à nouveau");
            context.addMessage(null, fm);
        }
        clientSelected = new Client();
    }
    public void postProcessXLS(Object document) {
        HSSFWorkbook wb = (HSSFWorkbook) document;
        HSSFSheet sheet = wb.getSheetAt(0);
        CellStyle style = wb.createCellStyle();
        style.setFillBackgroundColor(IndexedColors.AQUA.getIndex());
 
        for (Row row : sheet) {
            for (Cell cell : row) {
                cell.setCellValue(cell.getStringCellValue().toUpperCase());
                cell.setCellStyle(style);
            }
        }
    }
}
