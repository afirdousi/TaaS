# Crowd-based Mobile Testing Community SaaS

> A cloud based community that offers Testing-as-a-Service.
> You can login as a Tester to test the applications or as a Provider to get your App tested.

## Abstract

> Mobile Testing as a Service (MTaaS) is becoming a necessity in current mobile software development environments were many different devices and operating systems coexist and interoperability between them is expected by the end user.  This wide array of technology represent a challenge to current mobile developers, since it increase the cost associated to testing and can delay the software development process.  Based on this, we designed a crowd-sourcing multi-tenant Software as a Service (SaaS) platform to support mobile software testing.

## Objective

> This project objective is to design a crowd-sourcing Mobile Testing as a Service (MTSaaS) platform for customers/providers to test their software or mobile apps by using crowd sourced communities and their diverse resources.  This platform will support 24/7 access, reporting and communication interface between testers and providers and will be delivered as “on-Demand” service.

## Project Structure

1.	Src – holds the angular app, in the app folder.

    > 1.1	App
        1.1.1	Views – all views and controllers
        1.1.2	Services – all angular services
        1.1.3	Directives – holds all the directives
        1.1.4	Data – all JSON files

    > 1.2	Styles – images and css files in img and css folder resp.

    > 1.3	Vendor – holds all vendor specific libraries, for which we don’t do npm {angular, angular ui router, jquery ui and jquery}

2.	Server

    > 2.1	Api – holds all internal (called from within the system) as well as external apis
    > 2.2	Config – holds all web settings including port number, mongodb config settings, authentication secret key, application version number. All these settings are within ‘websettings.js’
    > 2.3	Db – this will hold all modules related to mongodb connection.
    > 2.4	Middleware – will hold all server side business logic, and all these will be injected into express logic.
    > 2.5	Services – hold all server side services, all angular services(1.1.2) will connect to these services and these services will eventually connect to business logic in ‘middleware’ folder as well as connect to mongodb.

3.	Test – hold all unit tests written in jasmine js.

4.	Express-server.js – the main node.js server for the app.

5.	Karma.conf.js – karma is a test launcher and runner which runs all the test within test folder.

6.	Package.json – holds all npm dependencies.

7.	Bower.json – holds all bower dependencies

8.	Readme.md – hold all details of the app and also instructions on how to run.


## Quick Start

#### Install

```sh
$ npm install
```

#### Start

##### Normal
```sh
$ node express-server.js
```

##### Test Mode
```sh
$ node express-server.js --test-mode

Username : test
Password : password
```

where express-server.js is the name of your main Node application JavaScript file.

### TaaS External API Demo:

>Open Post Man
>Make call to http://localhost:9001/api/authenticate
 with body params
 userName:abc
 password:123
>Copy token in response
>make a new get request,
 for example: http://localhost:9001/api/projects 
 In the headers,
 put x-access-token and pass the token value to it