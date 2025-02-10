package com.yashkolte.modernoptim.controller;

import com.yashkolte.modernoptim.services.DatabaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin("http://localhost:3000/")
@RestController
@RequestMapping("/database")
// @CrossOrigin(origins = "http://localhost:5173")
public class DatabaseController {

    @Autowired
    private DatabaseService databaseService;

    @GetMapping("/tables")
    public List<String> getTableNames() {
        return databaseService.getTableNames();
    }
}