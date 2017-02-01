const BUCKET = "atomakabucket"

const fs = require("fs")
const unzipper = require("unzipper")
const aws = require("aws-sdk")
aws.config.update({ region: "us-east-1" })
const s3 = new aws.S3()

s3
  .getObject({ Bucket: BUCKET, Key: "hello.zip" })
  .createReadStream()
  .pipe(unzipper.Parse())
  .on('entry', file => {
    file.pipe(fs.createWriteStream(file.path))
      .on('finish', () => {
        s3.putObject(
          { Bucket: BUCKET, Key: file.path, Body: fs.createReadStream(file.path) }
        ).promise()
          .then(() => console.log("success"))
          .catch(err => console.log(err))
      })
  })
