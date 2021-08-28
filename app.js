const CSVToJSON = require('csvtojson');
let csvFilePath = 'courses.csv';
let api_config = require('./api_config.json');

async function mainAppRun(csv) {
    const courses = await CSVToJSON().fromFile(csv)
    for (var i = 0; i < courses.length; i++) {
        courses[i]["Notes"] = "Submitted by Shawn Stensberg";
    }
    console.log(courses);
}
mainAppRun(csvFilePath)