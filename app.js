const CSVToJSON = require('csvtojson');
const axios = require('axios');
let csvFilePath = 'courses.csv';
let api_config = require('./api_config.json');

// async function mainAppRun(csv) {
//     const courses = await CSVToJSON().fromFile(csv)
//     for (var i = 0; i < courses.length; i++) {
//         courses[i]["Notes"] = "Submitted by Shawn Stensberg";
//     }
//     console.log(courses);
// }
// mainAppRun(csvFilePath)


const connectionConfig = {
    headers: {
        'Authorization': api_config.API_KEY
    }
}

axios.get(api_config.BASE_URL + api_config.CAMPUSES_OPTIONS_URI, connectionConfig)
    .then((response) => {
        console.log(response.data);
    })
    .catch((err) => {
        console.log(err)
    })