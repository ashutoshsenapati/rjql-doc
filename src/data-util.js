let aggip = `{
	"data": {
		"employees": [{
				"name": "John",
				"age": 30,
				"salary": 70000,
				"department": "Software"
			},
			{
				"name": "Harry",
				"age": "25",
				"salary": 60000,
				"department": "Admin"
			}

		]
	}
}`;

let sort_ex = `{
    "name":"John",
    "age":30,
    "cars":[ "BMW", "Fiat", "Ford" ]
}`;


let common = `{
    "data": {
       "name": "John",
        "age": 30,
        "cars": [
            {
                "property": [
                    {
                        "color": "white",
                        "model": "LeafPlus",
                        "fuelType": "electric"
                    }
                 ],
                    "company": "Nissan",
                    "id": "AA97B177-9383-4934-8543-0F91A7A02836"
                },
            {
                "property": [
                    {
                        "color": "red",
                        "model": "Z4",
                        "fuelType": "diesel"
                    }
                ],
                    "company": "BMW",
                    "id": "BA97B177-9124-4934-8786-0F91A7C6754"
                }
            ]
       }
    }`;


let in_2_ex = `{
    "name":"John",
    "age":30,
    "cars":[ "Ford", "BMW", "Fiat" ]
}`;


let conj_json = `{
    "data": {
        "tgsvUniqueKey": "weywevwewe",
        "source": "TGSV",
        "type": "tcu2k",
        "version": "1.0.0",
        "dataFields": [
            {
                "series": [
                    {
                        "timeStamp": "2019-08-18T23:59:56",
                        "triggerOrContextName": "StatusData",
                        "type": "LKCD",
                        "value": "2019-08-18T23:59:56"
                    }
                ],
                "name": "MsnAcquisitionDate"
            },
            {
                "series": [
                    {
                        "timeStamp": "2019-08-19T00:00:15.000Z",
                        "triggerOrContextName": "StatusData",
                        "type": "LKCD",
                        "value": "The Vehicle Battery is low!!!"
                    }
                ],
                "name": "MapVersion64Byte_Upper16Byte"
            },
            {
                "series": [
                    {
                        "timeStamp": "2019-08-19T00:00:15.000Z",
                        "triggerOrContextName": "StatusData",
                        "type": "LKCD",
                        "value": "Less fuel!!!"
                    }
                ],
                "name": "MsnAcquisition"
            }
        ],
        "vin": "wrerqwer45qwqwr45",
        "tcu_gen": "TCU2K",
        "platform_name": "gamma",
        "event_occur_timeStamp": "2019-08-19T00:00:15.000Z",
        "event_arrival_timeStamp": "2020-01-06T05:59:19.273Z"
    }
}`;


export function initExamples($examples) {
    setCountExample($examples);
    setSumExample($examples);
    setAvgExample($examples);
    setMaxExample($examples);
    setMinExample($examples);
    setsortExample($examples);
    setUUIDExample($examples);
    setregexExample($examples);
    setinExample($examples);
    setIPExample($examples);
    setArraysExample($examples);
    setSingleValuesExample($examples);
    setConjuctionExample($examples);
}

function setCountExample($examples) {
    $examples["count"] = {};

    $examples.count.json = aggip;

    $examples["count1"] = {};


    $examples.count1.json = aggip;
    $examples.count.rjql = ` data>employees[]:
    $count{department} = "2"`;

    $examples.count1.rjql = ` data>employees[]:
    $count{department:/Software/} = 1`;
}

function setSumExample($examples) {

    $examples["sum"] = {};
    $examples.sum.json = aggip;
    $examples.sum.rjql = ` data>employees[]:
    $sum{salary} = 130000`;
}

function setAvgExample($examples) {

    $examples["avg"] = {};
    $examples.avg.json = aggip;
    $examples.avg.rjql = ` data>employees[]:
    $avg{salary} = 65000`;
}

function setMaxExample($examples) {

    $examples["max"] = {};
    $examples.max.json = aggip;
    $examples.max.rjql = ` data>employees[]:
    $max{salary} = 70000`;
}

function setMinExample($examples) {
    $examples["min"] = {};
    $examples.min.json = aggip;
    $examples.min.rjql = ` data>employees[]:
    $min{salary} = 60000`;
}

function setsortExample($examples) {
    $examples["sort"] = {};

    $examples.sort.rjql = `cars[] = "$asort"`;
    $examples.sort.json = sort_ex;

    $examples["sort1"] = {};
    $examples.sort1.rjql = ` cars[] = "$dsort"`;
    $examples.sort1.json = sort_ex;
}

function setUUIDExample($examples) {
    $examples["uuid"] = {};
    $examples.uuid.rjql = `data>cars[]:
    id = "$uuid"`;
    $examples.uuid.json = common;
}

function setregexExample($examples) {
    $examples["regex"] = {};
    $examples.regex.rjql = `data>cars[]:
    company = "BMW"
    property[]:
        model = "$regex{/^[a-z]$/}"`;
    $examples.regex.json = common;
}

function setinExample($examples) {
    $examples["in"] = {};

    $examples.in.rjql = `name = "$in{'John'}"`;
    $examples.in.json = in_2_ex;

    $examples["in_2"] = {};
    $examples.in_2.json = in_2_ex;
    $examples.in_2.rjql = ` cars = "$in{'Ford', 'BMW', 'Fiat'}"`;
}

function setIPExample($examples) {
    $examples["ip"] = {};

    $examples.ip.json = `[{
        "id": 1,
        "first_name": "Jeanette",
        "last_name": "Penddreth",
        "email": "jpenddreth0@census.gov",
        "gender": "Female",
        "ip_address": "26.58.193.2"
      }, {
        "id": 2,
        "first_name": "Giavani",
        "last_name": "Frediani",
        "email": "gfrediani1@senate.gov",
        "gender": "Male",
        "ip_address": "229.179.4.212"
      }, {
        "id": 3,
        "first_name": "Noell",
        "last_name": "Bea",
        "email": "nbea2@imageshack.us",
        "gender": "Female",
        "ip_address": "180.66.162.255"
      }, {
        "id": 4,
        "first_name": "Willard",
        "last_name": "Valek",
        "email": "wvalek3@vk.com",
        "gender": "Male",
        "ip_address": "67.76.188.26"
      }]`;
    $examples.ip.rjql = `[]:
    ip_address = "$ip"`;
}


function setArraysExample($examples) {
    $examples["arrays"] = {};
    $examples.arrays.json = `{
    "name":"John",
    "age":30,
    "cars":[ "Ford", "BMW", "Fiat" ]
}`;
    $examples.arrays.rjql = ` cars[0] = "Ford" `;

    $examples["arrays1"] = {};
    $examples.arrays1.json = `{
   "data": {
    "name": "John",
    "age": 30,
    "cars": [
        {
            "property": [
                {
                    "color": "white",
                    "model": "LeafPlus",
                    "fuelType": "electric"
                }
            ],
                "company": "Nissan",
                "id": "AA97B177-9383-4934-8543-0F91A7A02836"
            },
        {
            "property": [
                {
                    "color": "red",
                    "model": "Z4",
                    "fuelType": "diesel"
                }
            ],
                "company": "BMW",
                "id": "BA97B177-9124-4934-8786-0F91A7C6754"
            }
        ]
    }
}`;

    $examples.arrays1.rjql = ` data>cars[]:
    company = "Nissan"
    property[]:
        model = "LeafPlus" `;
}


function setSingleValuesExample($examples) {

    $examples["singlevalues"] = {};
    $examples.singlevalues.json = `{
  "name": "John",
  "age": 30
}`;
    $examples.singlevalues.rjql = ` name = "John" `;

    $examples["singlevalues1"] = {};
    $examples.singlevalues1.json = $examples.singlevalues.json;
    $examples.singlevalues1.rjql = ` age >= 20 `;

    $examples["singlevalues2"] = {};
    $examples.singlevalues2.json = `{
  "name": "John",
  "age": 30,
  "address":
  {
    "city": "Dallas",
    "pincode": 75201
  }
}
  `;
    $examples.singlevalues2.rjql = ` address>city = "Dallas"`;
}


function setConjuctionExample($examples) {
    $examples.and = {
        json: conj_json,
        rjql: `data>dataFields[]:
    name = "MsnAcquisitionDate"
    series[]:
        value = "2019-08-18T23:59:56"
&&        
data>dataFields[]:
    name = "MsnAcquisition"
    series[]:
        value = "Less fuel!!!"
        `
    };

    $examples.or = {
        json: conj_json,
        rjql: `data>dataFields[]:
    name = "MsnAcquisitionDate"
    series[]:
        value = "2019-08-18T23:59:56"
||        
data>dataFields[]:
    name = "MapVersion64Byte_Upper16Byte"
    series[]:
        type = "LKCD"
        `
    };

}