/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.DAO;

import com.Model.Client;
import java.util.List;

/**
 *
 * @author DjazzJah
 */
public interface ClientDAO {
     List<Client> getListAll();

    void createClient(Client client);

    void deleteClient(String id);

    void updateClient(Client client);

    String test_client(String id);
}
