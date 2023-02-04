// Import and require mysql2
const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');
var deptID 

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
                choices: ['View All Employees', 'Add an Employee', 'Update an Employee Role', 'View All Roles', 'Add a Role', 'View all Departments', 'Add a Department', 'Quit'],

            },
        ])
        .then((data) => {
            if (data.main == 'View All Employees') {
                viewAllEmployees()
            } else if (data.main == 'Add an Employee') {
                addEmployees()
            } else if (data.main == 'Update an Employee Role') {
                updateEmployeeRole()
            } else if (data.main == 'View All Roles') {
                viewAllRoles()
            } else if (data.main == 'Add a Role') {
                addRole()
            } else if (data.main == 'View all Departments') {
                allDepartments()
            } else if (data.main == 'Add a Department') {
                addDepartment()
            } else if (data.main == 'Quit') {
                return
            }
        })
}

function viewAllEmployees() {
    const sql = `SELECT * FROM employee`;
    db.query(sql, function (err, rows) {
        console.table(rows);
        mainMenu()
    });
};

function addEmployees() {

}

function updateEmployeeRole() {

}

function addRole() {
    
    db.query(`SELECT * FROM department`, function (err, rows) {
        
   
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter the name of the new role.',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary of the new role.',
            },
            {
                type: 'list',
                name: 'department',
                message: 'Which department does the new role belong to?',
                choices: rows,
            },
        ])
        .then((data) => {
            console.log(data.department)
            console.log(rows.name) //Need to fix this by targeting all of the names inside of the rows object to properlly compare against it
            for (let i=0; i< rows.length; i++) {
                if (rows.name(i) == data.department) {
                    deptID = i;
                    console.log('ID added correctly')
                }
            }
            const sql = `INSERT INTO role (title, salary,department_id) VALUES ("${data.name}",${data.salary},${deptID});`
            db.query(sql, function (err, rows) {
                console.log(`"${data.name}",${data.salary},${deptID}`)
                console.log(`${data.name} Role Added`)
                mainMenu()
            });
            
        })
    });
}

function viewAllRoles() {
    const sql = `SELECT role.id,title,salary,department.name as department FROM role JOIN department ON department.id = role.department_id;`;
    db.query(sql, function (err, rows) {
        console.table(rows);
        mainMenu()
    });
}

function allDepartments() {
    const sql = `SELECT * FROM department`;
    db.query(sql, function (err, rows) {
        console.table(rows);
        mainMenu()
    });
}

function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'main',
                message: 'Enter the name of the new department.',
            },
        ])
        .then((data) => {
            const sql = `INSERT INTO department (name) VALUES ("${data.main}");`
            db.query(sql, function (err, rows) {
                console.log(`${data.main} Department Added`)
                mainMenu()
            });
        })
}

console.log('--------Employee Manager--------')
// Starting program with displaying the main menu
mainMenu()