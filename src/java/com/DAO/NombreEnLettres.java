/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.DAO;

/**
 *
 * @author Machines
 */
public class NombreEnLettres {
  public final  String FR = "FR" ;
    public final  String BE = "BE" ;
     String stx = FR ;

    public NombreEnLettres() {
    }


    public  String convertirEnEuros(double nombre, String syntaxe) {
        String doubleEnString = String.format(java.util.Locale.FRENCH,"%.2f", nombre);
        String strEntiere = doubleEnString.substring( 0,doubleEnString.length() -3) ;
        String strFraction = doubleEnString.substring(doubleEnString.length() -2, doubleEnString.length()) ;

        String mot = "" ;

        try {
        if(!(strEntiere.equals("0")))
            mot = convertirEntier(Long.parseLong(strEntiere), syntaxe)
                    + " Ariary"
                    + ((Long.parseLong(strEntiere) > 1L)?"":"")
                    + (!strFraction.equals("00") ? " et " : "") ;
        if(!(strFraction.equals("00")))
            mot = mot + convertirEntier(Long.parseLong(strFraction), syntaxe)
                    + " cent"
                    + ((Long.parseLong(strFraction) > 1L)?"s":"");
        } catch(NombreTropGrandException e) {
            mot = e.getMessage() ;
        }
        return mot ;
   }
   public  String convertirEntier(long nombre, String syntaxe)
           throws NombreTropGrandException {
       stx = syntaxe ;
       if(nombre > 999999999999L)
           throw new NombreTropGrandException(
                   "Le nombre demandé est trop grand...") ;
       else
           return entierEnLettres(String.valueOf(nombre));
   }

     private  String entierEnLettres(String strNombre) {
       int longueur ;
       String groupe ;
       String chaineAConvertir ;
       String mot = "";
       final String MILLIARD = " milliard";
       final String MILLION = " million";
       final String MILLE = " mille";

       while (strNombre.length() > 0) {

           longueur = strNombre.length() ;
           groupe = "" ;
           chaineAConvertir = "" ;

           if(longueur > 9)
               groupe = MILLIARD ;

           else if(longueur > 6)
               groupe = MILLION ;

           else if(longueur > 3)
               groupe = MILLE ;

           else
               return (mot + dechiffrage(strNombre)).trim() ;

           long test = longueur ;

           //Si le nombre de chiffres est multiple de 3
           if (((long)longueur % 3) == 0) {
               chaineAConvertir = strNombre.substring(0, 3) ;
               strNombre = strNombre.substring(3) ;

               if(Integer.parseInt(chaineAConvertir) > 1)
                   mot = mot + dechiffrage(chaineAConvertir) + groupe
                           + (!groupe.equals(MILLE) ? "" : "");

               else if(Integer.parseInt(chaineAConvertir) > 0)
                   mot = mot + groupe ;

           } else {
               if (((test - 1) % 3) == 0) {
                   chaineAConvertir = strNombre.substring(0, 1) ;
                   strNombre = strNombre.substring(1) ;

               } else {
                   chaineAConvertir = strNombre.substring(0, 2) ;
                   strNombre = strNombre.substring(2) ;
               }
               if(chaineAConvertir.equals("1") && groupe.equals(MILLE))
                   mot = mot + groupe ;
               else
                   mot = mot + sousDechiffrage(chaineAConvertir) + groupe
                           + ((Integer.parseInt(chaineAConvertir) > 1)
                           && (!groupe.equals(MILLE)) ? "s" : "" ) ;
           }
       }
       return mot.trim() ;
   }

   /*
    * Transforme en lettres de 0 à 999
    */
   private  String dechiffrage(String strNombre) {

       String plu = "s" ;
       String mot = "" ;
       final String CENT = "cent" ;
       String chaineAConvertir = "" ;
       int longueur = strNombre.length() ;

       //Si le nombre de chiffres est multiple de 3
       if (((long)longueur % 3) == 0) {

           chaineAConvertir = strNombre.substring(0, 1) ;

           if(Integer.parseInt(chaineAConvertir)>1)
               mot = mot + sousDechiffrage(chaineAConvertir);

           if(Integer.parseInt(chaineAConvertir)>0)
               mot = mot + " " + CENT  +
               //gestion du "s" de "CENT"
               ((!(Integer.parseInt(strNombre.substring(1)) > 0))
                       && (Integer.parseInt(chaineAConvertir) > 1) ? "s" : "") ;

           strNombre = strNombre.substring(1) ;

           if(Integer.parseInt(strNombre) > 0)
               mot = mot + sousDechiffrage(strNombre) ;
       }

       //sinon il est plus petit que 100 mot direct
       else
           return sousDechiffrage(strNombre) ;

       return String.format("%s", mot) ;
   }

   /*
    * transforme en lettres de zéro à 99 syntaxe française par défaut,
    * remplacer "String stx = FR ;" par "String stx = BE ;" pour la syntaxe
    * belge
    */
   private  String sousDechiffrage(String nombre) {
       /*
       final String FR = "FR" ;
       final String BE = "BE" ;
       String stx = FR ;
       */
       String mot = "" ;
       int longueur ;
       String et = "" ;

       String[] tabnb = { "zéro", "un", "deux", "trois", "quatre", "cinq",
       "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize",
       "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf" } ;

       String[] tabdix = { "vingt", "trente", "quarante", "cinquante",
       //"soixante", "soixante", "quatre-vingt", "quatre-vingt" } ;
       "soixante", "septante", "quatre-vingt", "nonante" } ;

       while(nombre.length() > 0) {
           longueur = nombre.length();
           et = "" ;

           switch(longueur) {

               case 1 :
                   mot = mot + " " + tabnb[Integer
                           .parseInt(nombre)] + et ;
                   nombre = "" ;
                   break ;

               case 2 :
                   if(Integer.parseInt(nombre) < 20) {
                       mot = mot + " " + tabnb[Integer
                               .parseInt(nombre)] + et ;
                       nombre = "" ;

                   } else if(Integer.parseInt(nombre) >= 20) {

                       //gestion du "et-un" au dessus de 20
                       if((Integer.parseInt(nombre.substring(1,2)) == 1)
                               &&(((Integer.parseInt(nombre) < 80)
                               && stx.equals(FR))||stx.equals(BE)))
                           et = " et" ;

                       //gestion du "s" de quatre vingts
                       else if ((Integer.parseInt(nombre) == 80)
                               && stx.equals(FR))
                           et = "s" ;

                       mot = mot + " " + tabdix[Integer
                               .parseInt(nombre.substring(0, 1))
                               //gestion du soixante (dix) et quatre-vingt (dix)
                               -
                               (((Integer.parseInt(nombre.substring(0, 1)) == 7) ||
                               (Integer.parseInt(nombre.substring(0, 1)) == 9)) &&
                               stx.equals(FR) ? 3 : 2 )
                               ] + et ;

                        if(((Integer.parseInt(nombre) < 70) && stx.equals(FR))
                            || stx.equals(BE))
                            nombre = nombre.substring(1, 2) ;

                        else if(Integer.parseInt(nombre) < 80)
                            nombre = (Integer.parseInt(nombre) - 60) + "" ;

                        else if(Integer.parseInt(nombre) < 100)
                            nombre = (Integer.parseInt(nombre) - 80) + "" ;
                   }
           }
       }
       //enlever le zéro inutile
       if (mot.trim().length() != tabnb[0].length())
           mot = mot.replaceFirst( " " + tabnb[0], "");

       //remplacer "quatre-vingt" par octante (quoi? t'as un blème ?)
       if (stx.equals(BE))
           mot = mot.replaceFirst(tabdix[6], "quatre-vingt");

       return String.format("%s", mot) ;
   }
}  
class NombreTropGrandException extends Exception {

    public NombreTropGrandException(String message) {
        super(message);
    }

}
