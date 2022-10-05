const path = require('path')
const fs = require('fs')
const fsPromises = fs.promises
const S3 = require('aws-sdk/clients/s3')

const s3 = new S3({
  endpoint: process.env.B2_ENDPOINT_URL,
  accessKeyId: process.env.B2_KEY_ID,
  secretAccessKey: process.env.B2_APPLICATION_KEY,
  signatureVersion: 'v4',
})

// uploads a file to b2
module.exports.uploadFile = (fileStreamPath, fileUploadPath) => {
  const fileStream = fs.createReadStream(fileStreamPath)
  return s3
    .upload({
      Key: fileUploadPath,
      Bucket: process.env.B2_BUCKET_NAME,
      Body: fileStream,
    })
    .promise()
}

// downloads a file from b2
module.exports.getFileStream = async (fileKey) => {
  try {
    const params = {
      Key: fileKey,
      Bucket: process.env.B2_BUCKET_NAME,
    }
    await s3.headObject(params).promise()
    return s3.getObject(params).createReadStream()
  } catch (err) {
    console.log('Error while creating read-stream!\n', err)
    return null
  }
}

module.exports.fetchFileToLocal = (fileKey, localBaseFolder) => {
  // fileKey = 'temp/ap_dhilon.jpg'
  // localBaseFolder = 'static'
  return s3
    .getObject({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: fileKey,
    })
    .promise()
    .then((result) => {
      console.log('b2-result: ', result)
      console.log('body', result.Body)
      const dirPath = path.join(localBaseFolder, path.dirname(fileKey))
      const localFilePath = path.join(dirPath, path.basename(fileKey))
      return fsPromises.mkdir(dirPath, { recursive: true }).then(() => {
        return fsPromises
          .writeFile(localFilePath, result.Body)
          .then((result) => {
            console.log('fs-result:', result)
            return localFilePath
          })
      })
    })
    .catch((err) => {
      console.log('err', err)
      return null
    })
}
