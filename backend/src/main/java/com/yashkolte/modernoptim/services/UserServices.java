package com.yashkolte.modernoptim.services;

import com.yashkolte.modernoptim.entity.User;
import com.yashkolte.modernoptim.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServices {
    @Autowired
    private UserRepository userRepo;

    public User addUser(User user) {
        return userRepo.save(user);
    }

    public boolean validateUser(String username, String password) {
        User user = userRepo.findByUsername(username);
        return user != null && user.getPassword().equals(password);
    }

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public void deleteUser(String username) {
        userRepo.deleteByUsername(username);
    }

    public User updateUsername(String oldUsername, String newUsername) {
        User user = userRepo.findByUsername(oldUsername);
        if (user != null) {
            user.setUsername(newUsername);
            return userRepo.save(user);
        }
        return null;
    }
}
