package com.yashkolte.modernoptim.controller;

import com.yashkolte.modernoptim.entity.User;
import com.yashkolte.modernoptim.services.UserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("http://localhost:3000/")
@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserServices userService;

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.addUser(user);
    }

    @PostMapping("/login")
    public boolean loginUser(@RequestBody User user) {
        return userService.validateUser(user.getUsername(), user.getPassword());
    }

    @GetMapping
    public List<User> getUsers() {
        return userService.getAllUsers();
    }

    @DeleteMapping("/{username}")
    public void deleteUser(@PathVariable String username) {
        userService.deleteUser(username);
    }

    @PutMapping("/{username}")
    public User updateUsername(@PathVariable String username, @RequestBody User user) {
        return userService.updateUsername(username, user.getUsername());
    }
}
