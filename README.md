# lulo-plugin-secret
[![npm version](https://badge.fury.io/js/lulo-plugin-secret.svg)](https://badge.fury.io/js/lulo-plugin-secret)
[![Build Status](https://travis-ci.org/carlnordenfelt/lulo-plugin-secret.svg?branch=master)](https://travis-ci.org/carlnordenfelt/lulo-plugin-secret)
[![Coverage Status](https://coveralls.io/repos/github/carlnordenfelt/lulo-plugin-secret/badge.svg?branch=master)](https://coveralls.io/github/carlnordenfelt/lulo-plugin-secret?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/carlnordenfelt/lulo-plugin-secret/badge.svg?targetFile=package.json)](https://snyk.io/test/github/carlnordenfelt/lulo-plugin-secret?targetFile=package.json)

lulu Secret generates a secret and stores it securely in AWS SSM Parameter Store.

lulo Secret is a [lulo](https://github.com/carlnordenfelt/lulo) plugin

# Installation
```
npm install lulo-plugin-secret --save
```

## Usage
### Properties
* Name: The name of the Parameter. Required
* For additional configuration options, please see [the aws sdk](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#putParameter-property)


### Return Values
When the logical ID of this resource is provided to the Ref intrinsic function, Ref returns the Name of the Parameter.


### Required IAM Permissions
The Custom Resource Lambda requires the following permissions for this plugin to work:
```
{
   "Effect": "Allow",
   "Action": [
        "ssm:putParameter",
        "ssm:getParameter",
        "ssm:deleteParameter"
   ],
   "Resource": "*"
}
```

In addition to the above, the plugin will need access to any custom KMS keys used (encrypt/decrypt).
If you use the AWS default key no additional key permissions is needed. 

## License
[The MIT License (MIT)](/LICENSE)

## Change Log
[Change Log](/CHANGELOG.md)
