const CSVToJSON = require('csvtojson');
const axios = require('axios');
let csvFilePath = 'courses.csv';
const api_config = require('./api_config.json');
const fetch = require('node-fetch')

// async function mainAppRun(csv) {
//     const courses = await CSVToJSON().fromFile(csv)
//     for (var i = 0; i < courses.length; i++) {
//         courses[i]["Notes"] = "Submitted by Shawn Stensberg";
//     }
//     console.log(courses);
// }
// mainAppRun(csvFilePath)

console.log(/\t\r\n/.test(api_config.API_KEY)); // test to determine if key has carriage returns, new lines, or tabs

const connectionConfig = {
    headers: {
        'Authorization': "Bearer " + api_config.API_KEY
    }
}

axios.get(api_config.BASE_URL + api_config.SUBJECTCODES_OPTIONS_URI, connectionConfig)
    .then((response) => {
        console.log(response.data);
    })
    .catch((err) => {
        console.log(err)
    })