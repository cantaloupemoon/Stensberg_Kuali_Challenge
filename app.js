const CSVToJSON = require('csvtojson')
const axios = require('axios')
let csvFilePath = 'courses.csv'
const api_config = require('./api_config.json')

// main app function that converts CSV to JSON and formats the raw JSON from the CSV to a prettier version meant to push to API per the assignment requirements
async function formattingFunc(csv) {
    var rawCourses = await CSVToJSON().fromFile(csv)
    var formattedCourses = []
    for (var i = 0; i < rawCourses.length; i++) {
        var newCourse = {
            "subjectCode": rawCourses[i].subjectCode,
            "number": rawCourses[i].number,
            "title": rawCourses[i].title,
            "credits": {
                "chosen": rawCourses[i].creditType,
                "credits": {
                    "min": "0",
                    "max": "0"
                },
                "value": "0",
            },
            "status": "draft",
            "dateStart": rawCourses[i].dateStart,
            "groupFilter1": "",
            "groupFilter2": "",
            "department": rawCourses[i].department,
            "campus": rawCourses[i].campus,
            "notes": "Shawn Stensberg says: Unicorns are Magnificent Beasts"
        }
        formattedCourses.push(newCourse)

        if (rawCourses[i].creditType == "fixed") {
            formattedCourses[i].credits.credits.min = rawCourses[i].creditsMin
            formattedCourses[i].credits.credits.max = rawCourses[i].creditsMin
            formattedCourses[i].credits.value = rawCourses[i].creditsMin

        } else if (rawCourses[i].creditType == "multiple") {
            delete formattedCourses[i].credits.min
            formattedCourses[i].credits.credits.max = rawCourses[i].creditsMax
            formattedCourses[i].credits.credits["min"] = rawCourses[i].creditsMin
            formattedCourses[i].credits.value = [
                rawCourses[i].creditsMin,
                rawCourses[i].creditsMax
            ]
        } else {
            formattedCourses[i].credits.credits.min = rawCourses[i].creditsMin
            formattedCourses[i].credits.credits.max = rawCourses[i].creditsMax
            formattedCourses[i].credits.value = {
                "min": rawCourses[i].creditsMin,
                "max": rawCourses[i].creditsMax
            }
        }
        if (rawCourses[i].dateStart.includes("Winter")) {
            formattedCourses[i].dateStart = "2021-01-01"
        } else if (rawCourses[i].dateStart.includes("Spring")) {
            formattedCourses[i].dateStart = "2021-04-03"
        } else if (rawCourses[i].dateStart.includes("Summer")) {
            formattedCourses[i].dateStart = "2021-07-04"
        } else {
            formattedCourses[i].dateStart = "2021-10-04"
        }
    }
    // console.log(JSON.stringify(formattedCourses))
    return formattedCourses
}

// executes formattingFunc to convert CSV to JSON and stores in variable I can use in the global scope
let jsonCourses = formattingFunc(csvFilePath)
let jsonSimple = JSON.stringify(jsonCourses)
console.log(jsonSimple)
jsonCourses.then(function(result){
    var courses = result

    // configuration for Authorization header to use in API calls
    const connectionConfig = {
        headers: {
            'Authorization': "Bearer " + api_config.API_KEY
        }
    }
    // API get request to retrieve subject codes
    axios.get(api_config.BASE_URL + api_config.SUBJECTCODES_OPTIONS_URI, connectionConfig)
        .then((response) => {
            for (var i = 0; i < response.data.length; i++) {
                for (var j = 0; j < courses.length; j++) {
                    if (courses[j].subjectCode == response.data[i].name) {
                        courses[j].subjectCode = response.data[i].id
                    }
                }
            }
            // console.log(courses)
        })
        .catch((err) => {
            console.log(err)
        })
    
    // API get request to retrieve groups based on department
    axios.get(api_config.BASE_URL + api_config.GROUPS_URI, connectionConfig)
        .then((response) => {
            for (var i = 0; i < response.data.length; i++) {
                for (var j = 0; j < courses.length; j++) {
                    if (courses[j].department == response.data[i].name) {
                        courses[j].groupFilter1 = response.data[i].updatedBy.id
                        courses[j].groupFilter2 = response.data[i].parentId
                        delete courses[i].department
                    }
                }
            }
            console.log(courses)
        })
        .catch((err) => {
            console.log(err)
        })
})
