package com.yashkolte.modernoptim.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@CrossOrigin("http://localhost:3000/")
@RestController
@RequestMapping("/dynamic")
public class DynamicTableController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Create a new table dynamically.
     * @param tableName The name of the table.
     * @param columns Column definitions in "columnName dataType" format.
     */
    @PostMapping("/createTable/{tableName}")
    public String createTable(@PathVariable String tableName, @RequestBody List<String> columns) {
        StringBuilder sql = new StringBuilder("CREATE TABLE IF NOT EXISTS " + tableName + " (id INT AUTO_INCREMENT PRIMARY KEY, ");
        for (String column : columns) {
            sql.append(column).append(", ");
        }
        sql.delete(sql.length() - 2, sql.length()); // Remove last comma
        sql.append(");");

        jdbcTemplate.execute(sql.toString());
        return "Table '" + tableName + "' created successfully!";
    }

    /**
     * Insert data into any dynamic table.
     * @param tableName The table where data should be inserted.
     * @param data Key-value pairs for column names and values.
     */
    @PostMapping("/insert/{tableName}")
    public String insertData(@PathVariable String tableName, @RequestBody Map<String, Object> data) {
        StringBuilder columns = new StringBuilder();
        StringBuilder values = new StringBuilder();

        for (Map.Entry<String, Object> entry : data.entrySet()) {
            columns.append(entry.getKey()).append(", ");
            values.append("'").append(entry.getValue()).append("', ");
        }
        columns.delete(columns.length() - 2, columns.length());
        values.delete(values.length() - 2, values.length());

        String sql = "INSERT INTO " + tableName + " (" + columns + ") VALUES (" + values + ")";
        jdbcTemplate.update(sql);
        return "Data inserted successfully into " + tableName;
    }

    /**
     * Get all rows from any table.
     * @param tableName The table name.
     */
    @GetMapping("/getAll/{tableName}")
    public List<Map<String, Object>> getAll(@PathVariable String tableName) {
        return jdbcTemplate.queryForList("SELECT * FROM " + tableName);
    }

    /**
     * Update data in any table.
     * @param tableName The table name.
     * @param id The row ID to update.
     * @param data Key-value pairs of columns and updated values.
     */
    @PutMapping("/update/{tableName}/{id}")
    public String updateData(@PathVariable String tableName, @PathVariable int id, @RequestBody Map<String, Object> data) {
        StringBuilder updateQuery = new StringBuilder("UPDATE " + tableName + " SET ");

        for (Map.Entry<String, Object> entry : data.entrySet()) {
            updateQuery.append(entry.getKey()).append(" = '").append(entry.getValue()).append("', ");
        }
        updateQuery.delete(updateQuery.length() - 2, updateQuery.length());
        updateQuery.append(" WHERE id = ").append(id);

        jdbcTemplate.update(updateQuery.toString());
        return "Row updated successfully in " + tableName;
    }

    /**
     * Delete a row from any table by ID.
     * @param tableName The table name.
     * @param id The ID to delete.
     */
    @DeleteMapping("/delete/{tableName}/{id}")
    public String deleteRow(@PathVariable String tableName, @PathVariable int id) {
        jdbcTemplate.update("DELETE FROM " + tableName + " WHERE id = ?", id);
        return "Row deleted successfully from " + tableName;
    }
}
