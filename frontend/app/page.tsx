"use client"
import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, RefreshCw, Save, LogOut, Database, UserPlus, LogIn  } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
type User = {
  username: string;
  password: string;
};

type TableData = {
  id: number;
  [key: string]: any;
};

const API_URL = 'http://localhost:8080';

const ModernDashboard = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [message, setMessage] = useState('');
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState('VARCHAR(255)');
  const [newColumns, setNewColumns] = useState<string[]>([]);
  const [newTableName, setNewTableName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newRowData, setNewRowData] = useState<{ [key: string]: string }>({});

  // Fetch tables
  const fetchTables = async () => {
    try {
      const response = await fetch(`${API_URL}/database/tables`);
      const data = await response.json();
      setTables(data);
      if (data.length > 0) {
        setSelectedTable(data[0]); // Select first table by default
      }
    } catch (error) {
      setMessage('Error fetching tables');
    }
  };

  // Fetch table data
  const fetchTableData = async (tableName: string) => {
    try {
      const response = await fetch(`${API_URL}/dynamic/getAll/${tableName}`);
      const data = await response.json();
      setTableData(data);
      // Initialize newRowData with empty values for each column
      if (data.length > 0) {
        const initialRowData: { [key: string]: string } = {};
        Object.keys(data[0]).forEach(key => {
          if (key !== 'id') {
            initialRowData[key] = '';
          }
        });
        setNewRowData(initialRowData);
      }
    } catch (error) {
      setMessage('Error fetching table data');
    }
  };

  // Insert new row
  const insertRow = async () => {
    try {
      const response = await fetch(`${API_URL}/dynamic/insert/${selectedTable}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRowData)
      });
      
      if (response.ok) {
        setMessage('Row inserted successfully');
        fetchTableData(selectedTable);
        // Reset form
        const resetData: { [key: string]: string } = {};
        Object.keys(newRowData).forEach(key => {
          resetData[key] = '';
        });
        setNewRowData(resetData);
      } else {
        setMessage('Error inserting row');
      }
    } catch (error) {
      setMessage('Error inserting row');
    }
  };

  // Create new table
  const createTable = async () => {
    try {
      await fetch(`${API_URL}/dynamic/createTable/${newTableName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newColumns)
      });
      setMessage(`Table ${newTableName} created successfully`);
      fetchTables();
      setNewTableName('');
      setNewColumns([]);
    } catch (error) {
      setMessage('Error creating table');
    }
  };

  // Add column to new table definition
  const addColumn = () => {
    if (newColumnName && newColumnType) {
      setNewColumns([...newColumns, `${newColumnName} ${newColumnType}`]);
      setNewColumnName('');
    }
  };

  // Delete row
  const deleteRow = async (id: number) => {
    try {
      await fetch(`${API_URL}/dynamic/delete/${selectedTable}/${id}`, {
        method: 'DELETE'
      });
      fetchTableData(selectedTable);
    } catch (error) {
      setMessage('Error deleting row');
    }
  };

  // Handle login
  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const success = await response.json();
      if (success) {
        setIsLoggedIn(true);
        setMessage('Login successful');
        fetchTables(); // Auto-fetch tables after login
      } else {
        setMessage('Invalid credentials');
      }
    } catch (error) {
      setMessage('Error logging in');
    }
  };

  const handleRegister = async () => {
    if (!username || !password) {
      setMessage('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        setMessage('Registration successful! You can now login.');
        setIsLogin(true); // Switch to login form
        // Clear the form
        setUsername('');
        setPassword('');
      } else {
        const data = await response.json();
        setMessage(data.message || 'Registration failed');
      }
    } catch (error) {
      setMessage('Error during registration');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setTables([]);
    setSelectedTable('');
    setTableData([]);
  };

  useEffect(() => {
    if (selectedTable) {
      fetchTableData(selectedTable);
    }
  }, [selectedTable]);

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-2xl">
              {isLogin ? (
                <LogIn className="mr-2 h-6 w-6" />
              ) : (
                <UserPlus className="mr-2 h-6 w-6" />
              )}
              {isLogin ? 'Login' : 'Register'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button 
                className="w-full" 
                onClick={isLogin ? handleLogin : handleRegister}
              >
                {isLogin ? 'Login' : 'Register'}
              </Button>
              {message && (
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage('');
                setUsername('');
                setPassword('');
              }}
            >
              {isLogin 
                ? "Don't have an account? Register" 
                : "Already have an account? Login"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <Database className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-xl font-semibold">Database Manager</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Welcome, {username}</span>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="p-8">
        <Tabs defaultValue="tables">
          <TabsList className="mb-8">
            <TabsTrigger value="tables">Existing Tables</TabsTrigger>
            <TabsTrigger value="create">Create Table</TabsTrigger>
          </TabsList>

          <TabsContent value="tables">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Database Tables</CardTitle>
                <Button variant="outline" size="icon" onClick={fetchTables}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex gap-2">
                    {tables.map((table) => (
                      <Button
                        key={table}
                        variant={selectedTable === table ? "default" : "outline"}
                        onClick={() => setSelectedTable(table)}
                      >
                        {table}
                      </Button>
                    ))}
                  </div>

                  {selectedTable && (
                    <>
                      {/* Insert Form */}
                      <Card className="mt-4">
                        <CardHeader>
                          <CardTitle>Insert New Row</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {Object.keys(newRowData).map((key) => (
                                <Input
                                  key={key}
                                  placeholder={key}
                                  value={newRowData[key]}
                                  onChange={(e) => 
                                    setNewRowData({
                                      ...newRowData,
                                      [key]: e.target.value
                                    })
                                  }
                                />
                              ))}
                            </div>
                            <Button onClick={insertRow}>
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Insert Row
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Table View */}
                      <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full">
                          <thead className="bg-gray-100">
                            <tr>
                              {tableData[0] && 
                                Object.keys(tableData[0]).map((key) => (
                                  <th key={key} className="p-2 text-center">{key}</th>
                                ))}
                              <th className="p-2 flex items-center justify-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tableData.map((row) => (
                              <tr key={row.id} className="border-t">
                                {Object.values(row).map((value, i) => (
                                  <td key={i} className="p-2 text-center">{String(value)}</td>
                                ))}
                                <td className="p-2 flex items-center justify-center">
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => deleteRow(row.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Table</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Table Name"
                    value={newTableName}
                    onChange={(e) => setNewTableName(e.target.value)}
                  />
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Column Name"
                      value={newColumnName}
                      onChange={(e) => setNewColumnName(e.target.value)}
                    />
                    <Input
                      placeholder="Data Type"
                      value={newColumnType}
                      onChange={(e) => setNewColumnType(e.target.value)}
                    />
                    <Button onClick={addColumn}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Column
                    </Button>
                  </div>

                  {newColumns.length > 0 && (
                    <div className="rounded-lg border p-4">
                      <h3 className="mb-2 font-medium">Columns:</h3>
                      <ul className="space-y-1">
                        {newColumns.map((col, i) => (
                          <li key={i}>{col}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button 
                    className="w-full" 
                    onClick={createTable}
                    disabled={!newTableName || newColumns.length === 0}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Create Table
                  </Button>

                  {message && (
                    <Alert>
                      <AlertDescription>{message}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ModernDashboard;