/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.Controller;

import com.DAO.CommandeDAO;
import com.DAO.CommandeImpl;
import com.DAO.FactureDAO;
import com.DAO.FactureImpl;
import com.DAO.NombreEnLettres;
import com.Model.Commande;
import java.awt.Color;
import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;

import java.util.Iterator;
import java.util.List;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.RequestScoped;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartUtilities;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.CategoryPlot;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.data.category.DefaultCategoryDataset;
import org.primefaces.model.DefaultStreamedContent;
import org.primefaces.model.StreamedContent;

/**
 *
 * @author DjazzJah
 */
@ManagedBean(name = "factureBean")
@RequestScoped
public class FactureController {

    /**
     * Creates a new instance of FactureController
     */
    FactureDAO dao;
    CommandeDAO daocm;
    private Commande commandeSelected;
    private List<Commande> listCm;
    private String total;
    private int total_chiffre;
    NombreEnLettres nl;

    public FactureController() {
        try {
            commandeSelected = new Commande();
            JFreeChart barChart = ChartFactory.createBarChart("HISTOGRAMME DES CHIFFRES DES AFFAIRES", "",
                    "chiffre d'Affaires", createDataset(), PlotOrientation.VERTICAL, true, true, false);
            barChart.setBackgroundPaint(Color.WHITE);
            barChart.getTitle().setPaint(Color.BLACK);
            CategoryPlot p = barChart.getCategoryPlot();
            p.setRangeGridlinePaint(Color.BLUE);
            File chartFile = new File("dynamichart");
            ChartUtilities.saveChartAsPNG(chartFile, barChart, 1000, 300);
            chart = new DefaultStreamedContent(
                    new FileInputStream(chartFile), "image/png");
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        nl = new NombreEnLettres();
    }

    public Commande getCommandeSelected() {
        return commandeSelected;
    }

    public int getTotal_chiffre() {
        return total_chiffre;
    }

    public void setTotal_chiffre(int total_chiffre) {
        this.total_chiffre = total_chiffre;
    }

    public String getTotal() {
        return total;
    }

    public void setTotal(String total) {
        this.total = total;
    }

    public void setCommandeSelected(Commande commandeSelected) {
        this.commandeSelected = commandeSelected;
    }

    public List<Commande> getListCm() {

        return listCm;
    }

    public void setListCm(List<Commande> listCm) {
        this.listCm = listCm;
    }

    public List<Commande> affichage() {
        int montant, mt = 0;
        dao = new FactureImpl();
        daocm = new CommandeImpl();
        listCm = dao.ListFacture(commandeSelected.getClient().getNumclient());
        commandeSelected = daocm.ListRecherche(commandeSelected.getClient().getNumclient());
        Iterator it = dao.ListFacture(commandeSelected.getClient().getNumclient()).iterator();
        while (it.hasNext()) {
            Commande commande = (Commande) it.next();
            montant = commande.getProduit().getPuproduit().intValue() * commande.getQtecommande().intValue();
            mt += montant;
        }
        total_chiffre = mt;
        total = nl.convertirEnEuros(mt, nl.BE);
        return listCm;
    }

    public List<Commande> chiffreTable() {
        dao = new FactureImpl();
        if (commandeSelected.getAnnee() == null) {
            listCm = dao.getJson("");
        } else {
            listCm = dao.getJson(commandeSelected.getAnnee());           
        }
        return listCm;
    }

    public List<Commande> comboAnnee() {
        dao = new FactureImpl();
        return dao.ListAnnee();
    }

    private StreamedContent chart;

//    public BackingBean() {
//       
//    }
    private DefaultCategoryDataset createDataset() {
        dao = new FactureImpl();
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();        
        Iterator it = dao.getJson("").iterator();
        while (it.hasNext()) {
            Commande object = (Commande) it.next();
            System.err.println(object.getQtecommande()+"-----"+ object.getClient().getNomclient());
            dataset.addValue(object.getQtecommande(), object.getClient().getNomclient(),"");
        }
        return dataset;

        //DefaultCategoryDataset dataset = new DefaultCategoryDataset();
    }

    public StreamedContent getChart() {
        return this.chart;
    }
}
//private BarChartModel barModel;
//    private HorizontalBarChartModel horizontalBarModel;
//    @PostConstruct
//    public void init() {
//        createBarModels();
//    }
// 
//    public BarChartModel getBarModel() {
//        return barModel;
//    }
//     
//    public HorizontalBarChartModel getHorizontalBarModel() {
//        return horizontalBarModel;
//    }
// 
//    private BarChartModel initBarModel() {
//        BarChartModel model = new BarChartModel();
// 
//        ChartSeries boys = new ChartSeries();
//        boys.setLabel("Boys");
//        boys.set("2004", 120);
//        boys.set("2005", 100);
//        boys.set("2006", 44);
//        boys.set("2007", 150);
//        boys.set("2008", 25);
// 
//        ChartSeries girls = new ChartSeries();
//        girls.setLabel("Girls");
//        girls.set("2004", 52);
//        girls.set("2005", 60);
//        girls.set("2006", 110);
//        girls.set("2007", 135);
//        girls.set("2008", 120);
// 
//        model.addSeries(boys);
//        model.addSeries(girls);
//         
//        return model;
//    }
//     
//    private void createBarModels() {
//        createBarModel();
//        createHorizontalBarModel();
//    }
//     
//    private void createBarModel() {
//        barModel = initBarModel();
//         
//        barModel.setTitle("Bar Chart");
//        barModel.setLegendPosition("ne");
//         
//        Axis xAxis = barModel.getAxis(AxisType.X);
//        xAxis.setLabel("Gender");
//         
//        Axis yAxis = barModel.getAxis(AxisType.Y);
//        yAxis.setLabel("Births");
//        yAxis.setMin(0);
//        yAxis.setMax(200);
//    }
//     
//    private void createHorizontalBarModel() {
//        horizontalBarModel = new HorizontalBarChartModel();
// 
//        ChartSeries boys = new ChartSeries();
//        boys.setLabel("Boys");
//        boys.set("2004", 50);
//        boys.set("2005", 96);
//        boys.set("2006", 44);
//        boys.set("2007", 55);
//        boys.set("2008", 25);
// 
//        ChartSeries girls = new ChartSeries();
//        girls.setLabel("Girls");
//        girls.set("2004", 52);
//        girls.set("2005", 60);
//        girls.set("2006", 82);
//        girls.set("2007", 35);
//        girls.set("2008", 120);
// 
//        horizontalBarModel.addSeries(boys);
//        horizontalBarModel.addSeries(girls);
//         
//        horizontalBarModel.setTitle("Horizontal and Stacked");
//        horizontalBarModel.setLegendPosition("e");
//        horizontalBarModel.setStacked(true);
//         
//        Axis xAxis = horizontalBarModel.getAxis(AxisType.X);
//        xAxis.setLabel("Births");
//        xAxis.setMin(0);
//        xAxis.setMax(200);
//         
//        Axis yAxis = horizontalBarModel.getAxis(AxisType.Y);
//        yAxis.setLabel("Gender");       
//    }
//    
//<p:chart type="bar" model="#{chartView.barModel}" style="height:300px"/>
// 
//<p:chart type="bar" model="#{chartView.horizontalBarModel}" style="height:300px"/>
