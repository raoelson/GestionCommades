/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.DAO;

import com.Model.User;
import java.util.List;

/**
 *
 * @author DjazzJah
 */
public interface UserDAO {
    List<User> ListAllUser();

    void createUser(User user);

    void deleteUser(int id);

    void updateUser(User user);
    
    String test_user(String id);
    
    boolean verification(String login,String password);
}
