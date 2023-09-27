const AWS = require("aws-sdk");
const AWS_region = process.env.AWS_REGION || "us-west-2"

console.log("AWS Region: ", AWS_region);
AWS.config.update({region: AWS_region})


const lambda = new AWS.Lambda()

const getLambdaFunctions = async () => {
    return lambda.listFunctions().promise()
        .then((res) => {
            return res["Functions"].map((func) => {
                return {
                    functionArn: func["FunctionArn"],
                    functionName: func["FunctionName"]
                }
            })
        })
}

const updateLambdasWithNameTag = async (lambdaFunctions) => {
    // console.log(lambdaFunctions)
    return lambdaFunctions.forEach((lambdaFunction) => {
        console.log(`Tagging resource: ${lambdaFunction['functionArn']} with {Name: ${lambdaFunction["functionName"]}}`)
        lambda.tagResource({
            Resource: lambdaFunction["functionArn"],
            Tags: {
                Name: lambdaFunction["functionName"]
            }
        })
            .promise()
    })
     
}

(async () => {
    await updateLambdasWithNameTag(await getLambdaFunctions())
})()
