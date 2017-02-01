const BUCKET = "atomakabucket"

const unzipper = require("unzipper")
const aws = require("aws-sdk")
aws.config.update({ region: "us-east-1" })
const s3 = new aws.S3()

s3
  .getObject({ Bucket: BUCKET, Key: "hello.zip" })
  .createReadStream()
  .pipe(unzipper.Parse())
  .on('entry', file => {
    s3.putObject({ Bucket: BUCKET, Key: file.path, Body: file }).promise()
      .then(() => console.log("then"))
      .catch(err => console.log(err))
  })
