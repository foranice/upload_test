let OSS = require('ali-oss');
let STS=OSS.STS
const express = require('express')
const app = express()
const port = 80




app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('/getToken',async (req, res) => {
    let token = await assumeRole()

    let result={
        code:0,
        data:token
    }
    result=JSON.stringify(result);
    res.send(result);
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
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
        return token.credentials
    } catch (e) {
        console.log(e);
    }
}
