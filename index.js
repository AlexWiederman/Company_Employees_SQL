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
    const sql = `SELECT employee.id,first_name,last_name,manager_id,role.title FROM employee JOIN role ON role.id = employee.role_id`;
    db.query(sql, function (err, rows) {
        console.table(rows);
        mainMenu()
    });
};

function addEmployees() {

    db.query(`SELECT id,title AS name FROM role`, function (err, roles) {

        db.query(`SELECT id,CONCAT(first_name," ",last_name) AS name FROM employee`, function (err, employees) {

            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'first',
                        message: 'What is the employees first name?',
                    },
                    {
                        type: 'input',
                        name: 'last',
                        message: 'What is the employees last name?',
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the employees role?',
                        choices: roles,
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Who is the employees manager?',
                        choices: employees,
                    },

                ])
                .then((data) => {
                    var roleID
                    var managerID
                    console.log(data.role)
                    // Going through all of the current roles to see which one is selected
                    for (let i = 0; i < roles.length; i++) {
                        if (roles[i].name == data.role) {
                            roleID = i + 1; //Adding one because this is a 0 index but the id starts at 1
                            console.log('Role added correctly')
                        }
                    }
                    // Going through all of the current employees to see which one is selected for manager
                    for (let i = 0; i < employees.length; i++) {
                        if (employees[i].name == data.manager) {
                            managerID = i + 1; //Adding one because this is a 0 index but the id starts at 1
                            console.log('Manager added correctly')
                        }
                    }
                    const sql = `INSERT INTO employee (first_name,last_name,manager_id,role_id) VALUES ("${data.first}","${data.last}",${managerID},${roleID});`
                    db.query(sql, function (err, rows) {

                        console.log(`${data.first} ${data.last} is Added`)
                        mainMenu(); //Going back to the main menu
                    });
                })

        })
    })

}

function updateEmployeeRole() {
    db.query(`SELECT id,CONCAT(first_name," ",last_name) AS name FROM employee`, function (err, names) {
        db.query(`SELECT id,CONCAT(first_name," ",last_name) AS name FROM employee`, function (err, roles) {
            console.log(rows)

            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employee',
                        message: 'Select Employee to update their role',
                        list: names,
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'Which role do you want to assign the selected employee',
                        list: roles,
                    },
                ])
                .then((data) => {

                    // Going through all of the current employees to see which one is selected for manager
                    for (let i = 0; i < names.length; i++) {
                        if (names[i].name == data.employee) {
                            var employeeID = i + 1; //Adding one because this is a 0 index but the id starts at 1
                            // console.log('')
                        }
                    }
                    // Going through all of the current roles to see which one is selected
                    for (let i = 0; i < roles.length; i++) {
                        if (roles[i].name == data.role) {
                            var roleID = i + 1; //Adding one because this is a 0 index but the id starts at 1
                            // console.log('Role added correctly')
                        }
                    }
                    const sql = `UPDATE employee SET role_id="${roleID}" WHERE id ="${employeeID}";`
                    db.query(sql, function (err, rows) {
                        console.log(`${data.employee} Role updated`)
                        mainMenu()
                    });

                })
        });
    });

}

function addRole() {

    db.query(`SELECT * FROM department`, function (err, rows) {
        console.log(rows)

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

                // Going through all of the current departments to see which one is selected
                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].name == data.department) {
                        deptID = i + 1; //Adding one because this is a 0 index but the id starts at 1
                    }
                }
                const sql = `INSERT INTO role (title, salary,department_id) VALUES ("${data.name}",${data.salary},${deptID});`
                db.query(sql, function (err, rows) {
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