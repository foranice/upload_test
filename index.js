//express部分

const express = require('express')
const app = express()
const port = 80
var bodyParser = require('body-parser');

app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use(bodyParser.json())

app.all('/getToken',async (req, res) => {
    let token = await assumeRole()

    let result={
        code:0,
        data:token
    }
    result=JSON.stringify(result);
    res.send(result);
})
app.all('/getUrl',async (req, res) => {
    body = req.body;
    let access_key_id = body.access_key_id
    let access_key_secret = body.access_key_secret
    let region = body.region
    let file_path = body.file_path
    let token = await Sign(access_key_id,access_key_secret,region,file_path)

    let result = {
        code:0,
        data:token
    }
    result=JSON.stringify(result);
    res.send(result);
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//OSS

let OSS = require('ali-oss');
let STS=OSS.STS
let sts = new STS({
    // 阿里云主账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM账号进行API访问或日常运维，请登录RAM控制台创建RAM账号。
    accessKeyId: 'LTAI4GBBhbrZdzwkSB6Lzsce',
    accessKeySecret: 'Zs6LFz7EuUPzDccGlbTBVJwjfh6kkx'
});
let policy = {
    "Statement": [
        {
            "Action": [
                "oss:Get*"
            ],
            "Effect": "Allow",
            "Resource": ["acs:oss::1885503572704933:'salary"]
        }
    ],
    "Version": "1"
};
async function assumeRole () {
    try {
        let token = await sts.assumeRole(
            'acs:ram::1885503572704933:role/salary', policy, 15*60, 'upload');
        return token
    } catch (e) {
        console.log(e);
    }
}
async function Sign (accessKeyId,accessKeySecret,region,file_name) {
    try {
        let client = new OSS({
            region: accessKeyId,
            accessKeyId: accessKeySecret,
            accessKeySecret: region
        })
        const url = client.signatureUrl(file_name);
        return url;
    } catch (e) {
        console.log(e);
    }
}
