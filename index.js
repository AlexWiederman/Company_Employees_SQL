// Import and require mysql2
const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password here
      password: 'password',
      database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
  );

function mainMenu() {
    inquirer
    .prompt([
        {
            type: 'list',
        name: 'main',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View all Departments', 'Add Department','Quit'],
        
        },
    ])
.then((data) => {
    if (data.main == 'View All Employees') {
        viewAllEmployees()
    } else if (data.main == 'Add Employee') {
        addEmployees()
    } else if (data.main == 'Update Employee Role') {
        updateEmployeeRole()
    } else if (data.main == 'View All Roles') {
        viewAllRoles()
    } else if (data.main == 'Add Role') {
        addRole()
    } else if (data.main == 'View all Departments') {
        allDepartments()
    } else if (data.main == 'Add Department') {
        addDepartment()
    }else if (data.main == 'Quit') {
        return
    }
})
}

// viewAllEmployees() {
    const sql = `SELECT * FROM employee`;
  db.query(sql, function (err, rows) {
    console.table(rows);
  });

// };