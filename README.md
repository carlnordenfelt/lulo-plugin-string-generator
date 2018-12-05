# lulo-plugin-string-generator
[![npm version](https://badge.fury.io/js/lulo-plugin-string-generator.svg)](https://badge.fury.io/js/lulo-plugin-string-generator)
[![Build Status](https://travis-ci.org/carlnordenfelt/lulo-plugin-string-generator.svg?branch=master)](https://travis-ci.org/carlnordenfelt/lulo-plugin-string-generator)
[![Coverage Status](https://coveralls.io/repos/github/carlnordenfelt/lulo-plugin-string-generator/badge.svg?branch=master)](https://coveralls.io/github/carlnordenfelt/lulo-plugin-string-generator?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/carlnordenfelt/lulo-plugin-string-generator/badge.svg?targetFile=package.json)](https://snyk.io/test/github/carlnordenfelt/lulo-plugin-string-generator?targetFile=package.json)

lulo String Generator generates a random string given the provided length.

Used together with `_NoEcho` it provdies a simple way to generate keys and passwords via CloudFormation.

lulo String Generator is a [lulo](https://github.com/carlnordenfelt/lulo) plugin


# Installation
```
npm install lulo-plugin-string-generator --save
```

## Usage
### Properties
* Length: The length of the string (Bytes). Default is 128 which is the equivalent of a 256 character string.
* _NoEcho: _NoEcho is a CustomResource feature that Lulo implements. Use this if you are generating strings that are sensitive, such as keys or passwords, to ensure that they do no leak. Simple set `_NoEcho` to `true`.

### Updates
Since the only property that can be changed is the length the secret will be regenerated for any update.

### Return Values
`!GetAtt 'MyStringResource.String'` will give the string.

### Example
```
Resources:
    MyString:
        Type: Custom::StringPlugin
        Properties:
            ServiceToken: lambda:arn
    MySecretString:
        Type: Custom::StringPlugin
        Properties:
            ServiceToken: lambda:arn
            Length: 256
            _NoEcho: true
```


### Required IAM Permissions
The Custom Resource does not require any permissions

## License
[The MIT License (MIT)](/LICENSE)

## Change Log
[Change Log](/CHANGELOG.md)
