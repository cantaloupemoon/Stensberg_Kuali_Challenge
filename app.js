const CSVToJSON = require('csvtojson');
const csvFilePath = 'courses.csv';
const fs = require('fs');

// function that converts CSV to JSON file
let getJson = function(csv) {
    CSVToJSON().fromFile(csv)
    .then(courses => {
        let coursesJSON = courses;
        console.log(coursesJSON);
        return coursesJSON;
    }).catch(err => {
        console.log(err);
    });
}

getJson(csvFilePath);