const CSVToJSON = require('csvtojson');
let csvFilePath = 'courses.csv';

// function that converts CSV to JSON file
async function convertCSVtoJSON(csv) {
    const courses = await CSVToJSON().fromFile(csv)
    return courses;
}

// function that addes notes to returned JSON
function addNotesToCourses(csvFilePath) {
    convertCSVtoJSON(csvFilePath)
        .then(courses => {
            for (let i = 0; i < courses.length; i++) {
                courses[i]["Notes"] = "Submitted by Shawn Stensberg"
            }
            console.log(courses)
        })
}

addNotesToCourses(csvFilePath);