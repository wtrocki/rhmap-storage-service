# RHMAP File Storage Service

Store and retrieve your files without hassle using mongodb gridfs storage engine.
Storage service was designed to run on RHMAP, but it can be easly adapted to run on docker and other servers with node.js and npm installed. 

## Technologies used:

- node 4.4.x
- express
- mongose 

See package.json for more information

## RHMAP Setup
There are currently some workarounds needed to get the service up and running within RHMAP the platform. 

1. Make the newly created service public
2. Visit the data browser, depending on your application configuration a "Upgrade Database" action will be available, this means the application is using an old/legacy shared database and it needs to be upgraded to use a dedicated one. Note the application needs to be first finished its initial deploy and be running to perform this task.
3. Re-deploy the service
4. You can now use the service under the "Preview" section of the studio. 

## Local and development setup

Install dependencies
    
    npm install

Execute grunt 

    grunt serve 

## Web interface

![](./images/mainview.png)

## API

> POST /api/files/

Upload file using multipart form-data body.

### Form body parts:
    
> file 

Represents binary file that would be uploaded.
For example `<input type="file" name="file"/>`
    
> redirectOnSuccess

If added instead of returning json results backend would redirect to path provided as value.
For example: `<input type="hidden" name="redirectOnSuccess" value="/"/>`
    

Example body:
```
------WebKitFormBoundaryKKdzzkCch9eo2hG0
Content-Disposition: form-data; name="file"; filename="yourfile.txt"
Content-Type: text/html

------WebKitFormBoundaryKKdzzkCch9eo2hG0
Content-Disposition: form-data; name="redirectOnSuccess"
/
```

> GET /api/files/:filename

Stream uploaded file

> DELETE /api/files/:filename

Delete uploaded file (file id can be used as well)

## Why using mongodb as storage solution

- When using mongo data and files are stored in one place (simplicity)
- Easy to scale using mongo mechanisms
- Easy to backup using existing mongo backup solutions
- Easy to monitor storage and provide alerts

![](./images/meme.png)

## Contributing

See CONTRIBUTING.md 
