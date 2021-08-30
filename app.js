const CSVToJSON = require('csvtojson');
const axios = require('axios');
let csvFilePath = 'courses.csv';
const api_config = require('./api_config.json');
const fetch = require('node-fetch')

// main app function that converts CSV to JSON
async function mainAppRun(csv) {
    var courses = await CSVToJSON().fromFile(csv)
    for (var i = 0; i < courses.length; i++) {
        courses[i]["Notes"] = "Submitted by Shawn Stensberg";
        if (courses[i].creditType == "fixed") {
            delete courses['creditType'];
            courses[i]["credits"] = {
                "min": courses[i].creditsMin,
                "max": courses[i].creditsMin
            }
            courses[i]["value"] = courses[i].creditsMin
            delete courses['creditsMin']
            delete courses['creditsMax']
        } else if (courses[i].creditType == "multiple") {
            delete courses['creditType'];
            courses[i]["credits"] = {
                "max": courses[i].creditsMax,
                "min": courses[i].creditsMin
            }
            courses[i]["value"] = [courses[i].creditsMin, courses[i].creditsMax]
            delete courses['creditsMin']
            delete courses['creditsMax']
        }
    }
    return courses;
}

// executes mainAppRun to convert CSV to JSON and stores in variable I can use in the global scope
let jsonCourses = mainAppRun(csvFilePath);
jsonCourses.then(function(result){
    var courses = result;
    console.log(courses);
    // // configuration for Authorization header to use in API calls
    const connectionConfig = {
        headers: {
            'Authorization': "Bearer " + api_config.API_KEY
        }
    }

    // // API get request to retrieve subject codes
    axios.get(api_config.BASE_URL + api_config.SUBJECTCODES_OPTIONS_URI, connectionConfig)
        .then((response) => {
            // console.log(response.data);
            for (var i = 0; i < response.data.length; i++) {
                for (var j = 0; j < courses.length; j++) {
                    if (courses[j].subjectCode == response.data[i].name) {
                        courses[j]["subjectCode"] = response.data[i].id;
                    }
                }
            }
        })
        .catch((err) => {
            console.log(err)
        })
    // console.log(courses)
})
