import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose  from 'mongoose';
import Issue from './models/Issue';

const mysql = require('mysql');


const app=express();
const router=express.Router();

app.use(cors());
app.use(bodyParser.json());


///////////////MySql Nod Js///////////
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'angular'
});

//conn.connect((err) => {
 // if (err) throw err;
  //console.log('Mysql Connected!');
//});

conn.connect(function(err) {
    if (err) throw err;
    //Select all customers and return the result object:
    conn.query("SELECT * FROM customers", function (err, result) {
      if (err) throw err;
      console.log(result);
    });
  });


/////////

mongoose.connect('mongodb://localhost:27017/issues');
const connection = mongoose.connection;
connection.once('open',()=>{
    console.log('Mongodb connection established successfully');
});

// get the complete object  mongoose
router.route('/issues').get((req,res) =>{
    Issue.find((err,issues)=>{
        if(err)
        console.log(err);
        else
        res.json(issues);
    });
});



// get the object on id based mongoose
router.route('/issues/:id').get((req,res)=>{
    Issue.findById(req.params.id,(err,issue)=>{
        if(err)
        console.log(err);
        else
        res.json(issue);
    });
});

// add the new object in collection mongoose
router.route('/issues/add').post((req,res)=>{
    let issue=new Issue(req.body);
    issue.save()
    .then(issue=>{
        res.status(200).json({'Issue':'Added successfully'});
    })
    .catch(err=>{
        res.status(400).send('Failed to create a new record');
    });
});

// update the collection object in mongoose
router.route('/issues/update/:id').post((req,res)=>{
    Issue.findById(req.params.id,(err,issue)=>{
        if(!issue)
            return next(new Error('Could not load document!'));
        else{
            issue.title= req.body.title;
            issue.responsible= req.body.responsible;
            issue.description = req.body.description;
            issue.severity=  req.body.severity;
            issue.status=  req.body.status;

            issue.save().then(issue=>{
                res.json('Update done!');
            }).catch(err=>{
                res.status(400).send('update failed!');
            });
        }
    });
});

// delete the collection object based on id from mongoose.
router.route('/issues/delete/:id').get((req,res)=>{
    Issue.findByIdAndRemove({_id: req.params.id},(err,issue)=>{
        if(err)
        res.json(err);
        else
        res.json('remove Successfully');
    });
});

app.use('/',router);

//app.get('/',(req,res)=> res.send('Hello World'));

app.listen(4000,()=> console.log('express server running on port 4000'));

