//initial parser test to parse CSV to JSON and create JSON file output

const CSVToJSON = require('csvtojson');
const csvFilePath = 'courses.csv';
const fs = require('fs');

CSVToJSON().fromFile(csvFilePath)
    .then(courses => {
        fs.writeFile('courses.json', JSON.stringify(courses, null, 4), (err) => {
            if (err) {
                throw err;
            }
            console.log("JSON array is saved.");
        });
    }).catch(err => {
        console.log(err);
    });