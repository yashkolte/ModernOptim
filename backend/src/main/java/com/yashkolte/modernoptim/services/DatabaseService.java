package com.yashkolte.modernoptim.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DatabaseService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<String> getTableNames() {
        return jdbcTemplate.queryForList("SHOW TABLES", String.class);
    }
}