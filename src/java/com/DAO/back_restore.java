/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.DAO;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Calendar;

/**
 *
 * @author DjazzJah
 */
public class back_restore {

    public back_restore() {
    }

    public void sauveBase(String nomBase) {
         try {
            String user = "root";
            //C:\wamp\bin\mysql\mysql5.6.12\bin
            int processComplete;
            Process runtimeProcess = Runtime.getRuntime().exec("C:\\wamp\\bin\\mysql\\mysql5.6.12\\bin\\mysqldump -u " + user + " gestioncommande -r d:/backup/"+nomBase+".sql");
            processComplete = runtimeProcess.waitFor();
            if (processComplete == 1) {//if values equal 1 process failed               
            } else if (processComplete == 0) {                
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void restoreBase(String store) {
        try {
            int processComplete;
            String executeCmd = "C:/wamp/bin/mysql/mysql5.6.12/bin/mysql -u root gestioncommande < d:\\backup\\"+store+".sql";
            Process runtimeProcess = Runtime.getRuntime().exec(new String[]{"cmd.exe", "/c", executeCmd});
            processComplete = runtimeProcess.waitFor();
            if (processComplete == 1) {
               
            } else if (processComplete == 0) {                
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
