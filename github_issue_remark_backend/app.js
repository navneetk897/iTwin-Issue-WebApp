
require('dotenv').config();

if (process.env.MYSQL_USERNAME === undefined) {
    throw new Error('Please add your MySql userName into .env file and restart the application.');
}

if (process.env.MYSQL_PASSWORD === undefined) {
    throw new Error('Please add your MySql Password into .env file and restart the application.');
}



const express = require('express');
const mysql = require('mysql');

const cors = require('cors');



const userName = process.env.MYSQL_USERNAME;
const password = process.env.MYSQL_PASSWORD;

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : userName,
    password : password,
    database: 'github_issue'
});



(() => {
    const sqlConnection = mysql.createConnection({
        host     : 'localhost',
        user     : userName,
        password : password,
      });
    
    
    sqlConnection.connect((error) => {
        if (error) {
            throw error;
        }
        console.log('connected to mysql server');
    })
    sqlConnection.query("SHOW DATABASES LIKE 'github_issue'", (error, results) => {
        if (error) {
            throw error;
        }
        if (results.length === 0) {
           sqlConnection.query('CREATE DATABASE github_issue', (err, res) => {
                if (err) {
                    throw err;
                }
                console.log('Database created.');
                sqlConnection.end();
           })
           const con = mysql.createConnection({
                host     : 'localhost',
                user     : userName,
                password : password,
                database: 'github_issue'
           });
           con.connect((err) => {
                if (err) {
                    throw err;
                }
                console.log('Connected to github_issue database.');
           });
           con.query('CREATE TABLE remarks (issue_id VARCHAR(40) NOT NULL PRIMARY KEY, remark VARCHAR(1000))', 
            (err, res) => {
                if (err) {
                    throw err;
                }
                console.log('Table created.');
                con.end();
                connection.connect((error) => {
                    if (error) {
                        throw error;
                    }
                    console.log('Connected to github_issue database.');
                })
            }
           )
        } else {
            connection.connect((error) => {
                if (error) {
                    throw error;
                }
                console.log('Connected to github_issue database.');
            })
        }
    })
})();













const app = express();

app.use(express.json());

app.use(cors({
    origin: '*'
}));

app.get('/issue/:id', (req, res) => {
    const issueId = req.params.id;
    connection.query(`SELECT * FROM remarks WHERE issue_id='${issueId}'`, (error, result) => {
        if (error) {
            throw error;
        }
        if (result.length > 0) {
            res.send(result[0]);
        } else {
            res.status(204).send({
                title: 'Issue remarks not found.'
            });
        }
    })
});


app.post('/issue', (req, res) => {
    const date = new Date();
    if (req.body.issueId === undefined || req.body.remark === undefined) {
        res.status(422).send({
            title: 'Requst is missing some fields.'
        })
    }
    const remarkData = {
        issue_id: req.body.issueId,
        remark: req.body.remark,
    }
    connection.query(`INSERT INTO remarks VALUES ('${remarkData.issue_id}', '${remarkData.remark}')`,
    (error, result) => {
        if (error) {
            if (error.errno === 1062) {
                res.status(403).send({
                    title: "Remark with provided issue id already exits."
                });
            } else {
                throw error;
            }
        }
        res.send({
            title: 'Remark saved successfully.'
        });
    }
    );
});


app.delete('/issue/:id', (req, res) => {
    const issueId = req.params.id;
    connection.query(`DELETE FROM remarks WHERE issue_id='${issueId}'`, (error, reuslt) => {
        if (error) {
            throw error;
        }
        res.send({
            title: 'Remark deleted successfully.'
        });
    });
});


app.get('/getHelloWorld', (req, res) => {
    res.send('Hello world!');
})


const port = process.env.PORT || 3001
console.log(process.env.PORT);

app.listen(port, () => {
    console.log(`Server is listening on ${port} port`);
})
