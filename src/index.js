/* ----------  PACKAGES ---------- */
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();
/* ++++++++++  PACKAGES ++++++++++ */


/* ---------- AXIOS HEADER ---------- */
const IS_PROD = false;
const accessToken = IS_PROD ? process.env.DACO_ACCESS_TOKEN_PROD : process.env.DACO_ACCESS_TOKEN_SANDBOX;
const axiosHeader = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
};
const apiBaseUrl = 'https://api.hubapi.com';
/* ++++++++++ AXIOS HEADER ++++++++++ */


/* ---------- CONSTANTS ---------- */
/* ++++++++++ CONSTANTS ++++++++++ */


/* ----------  FUNCTIONS ---------- */
async function handleError(err) {
    if (err.response) {
        console.log("Axios error:")
        console.log("data:", JSON.stringify(err.response.data));
        console.log("statusCode:", err.response.status);
        return {
            statusCode: err.response.status,
            message: err.toString
        }
    } else {
        console.log("message", err.message);
        return {
            statusCode: 400,
            message: err.message
        }
    }
}

async function createDealProperties(dealProperties) {
    const functionName = 'createDealProperties';
    try {
        let axiosConfig = {
            method: 'post',
            url: `${apiBaseUrl}/crm/v3/properties/0-3/batch/create`,
            headers: axiosHeader,
            data: {
                inputs: dealProperties
            }
        };

        let responseData = (await axios(axiosConfig)).data;
        console.log(`responseData ${JSON.stringify(responseData)}`)
        return {
            statusCode: 200,
            message: `Function ${functionName} successfully executed.`,
            body: responseData
        }
    } catch (err) {
        let responseHandleError = await handleError(err)
        return responseHandleError;
    } 
}
/* ++++++++++  FUNCTIONS ++++++++++ */


/* ----------  MAIN ---------- */
// -CUSTOM CODE
// exports.main = (async (event, callback) => {
// +CUSTOM CODE
(async () => {
    /*
    let errorOccurred = false;
    let error = null;
    let stack = null;
    */

    const customPropertyInternalValuePrefix ='daco';
    const types = ["hardware", "software", "managed_service", "professional_services"];
    const dealGroupName = "dealinformation";
    const names = {
        "tcv_billing_frequency_one_time": "TCV Summe €(einmalige Beträge)",
        "tcv_billing_frequency_monthly": "TCV Summe € (monatliche Beträge)",
        "margin_tcv_billing_frequency_one_time": "Marge Summe TCV (einmalige Beträge)",
        "margin_tcv_billing_frequency_monthly": "Marge Summe TCV (monatliche Beträge)",
        "margin_tcv_billing_frequency_percentage_one_time": "Marge in % TCV Summe (einmalige Beträge)",
        "margin_tcv_billing_frequency_percentage_monthly": "Marge in % TCV Summe (monatliche Beträge)"
    };

    try {
        const capitalize = (str) => {
            return str
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
        };

        const dealProperties = [];

        types.forEach(type => {
            Object.keys(names).forEach(name => {
                dealProperties.push({
                    name: `${customPropertyInternalValuePrefix}_${type}_${name}`,
                    label: `${capitalize(type)} ${names[name]}`,
                    groupName: dealGroupName,
                    type: 'number',
                    fieldType: 'number',
                    hidden: false,
                    displayOrder: -1,
                    description: '',
                    formField: false,
                    referencedObjectType: null,
                    calculationFormula: null,
                    hasUniqueValue: false,
                    externalOptions: false,
                    options: [],
                    numberDisplayHint: name.includes('percentage') ? 'percentage' : null
                });
            });
        });
        
        console.log(JSON.stringify(dealProperties,null,4));

        // create deal properties
        let responseCreateDealProperties = await createDealProperties(dealProperties)
        if (responseCreateDealProperties.body) {
            console.log(`message ${responseCreateDealProperties.message}`);
        } else {
            throw new Error(`Error with Status Code ${responseCreateDealProperties.statusCode}. Message: ${responseCreateDealProperties.message}`)
        }

    } catch (err) {
        console.log(err);
    }
    // -CUSTOM CODE
    /*
    callback({
        outputFields: {
            errorOccurred: errorOccurred,
            error: error,
            stack: stack
        }
    });
    */
    // +CUSTOM CODE
})()
    .catch(err => {
        console.error(err);
    })
// -CUSTOM CODE
// })
// +CUSTOM CODE
/* ++++++++++ MAIN ++++++++++ */