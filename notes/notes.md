*Questions and warnings*
- How does postman know the http address is being used by app?
- how is react 'hosted' on azure?
- does express watch the reaxct front end and respond to it?
- !don't forget the jest.config.js file!
- !ngrok pw: ServiceStub@2022

**TODO and QUESTIONS**
- difference between JSON.function() and response.json()?
- will removing module (or changing it) in the tsconfig create problems for react?
- why the need for the strange gaurds on the app.tsx return?
- is session storage the only way to save userdata and navigate to a new page after the login is susscessful? why add inputs to the setUser function in the props call inside login-page if sessionStorage does it for us. Wouldn't setUser only need to be called with no arguements?
- can the login page redirect to the other pages, instead of App doing it?
- so are components not always functions?
- why is the state inside login page not updating even though it passes down the updated value to employee page

**TODO**
- logging
- jest tests
- manager comments 
- manager approval buttons
- statistics page
- hosting
- github actions
- sonar cloud



**CREATION and REFERENCES**
npm init

npm i typescript
npm i jest
npm i @types/jest
npm i ts-jest
npm i @types/ts-jest
npm i express
npm i @types/express
npm i @azure/cosmos
npm i uuid
npm i @types/uuid
npm i ts-node
npm i ts-jest
npx ts-jest config:init //to allow jest with ts

cors!!!!
npm i cors
npm i @types/cors then add app.use(cors())

tsc --init  //for tsconfig.json


or

npx create-react-app my-app-name --template typescript

or 

npx create-react-app my-app-name --template redux-typescript
//npx create-react-app pleasantville-back --template redux-typescript
//can use . instead of app name to create in a previous folder

npm run build //allows an actual http server to exist for the front end
    - to use this command, a resource must be created on azure
ngrok //allows a local back end code to be put on the web where anyone can access it

setTimeout( [func], [time]);


------------------------------------------------------------

Adam's ngrok:
- http://2e9a-50-110-89-213.ngrok.io/books
    - !remember to start ngrok in another cmd alongside react
        - change the addresses in the code to request the ngrok endpoint

routing resource:
- https://v5.reactrouter.com/web/guides/quick-start
    -   install with npm install react-router-dom
    -   npm install @types/react-router-dom

- embbedded vs normalized data

recording summarys:
- thursday: react pleasantview backend, jest, dependency injection
    - ended at -2.12




**LAYOUT**
*Front End Pages - basically replaces postman - react-router will allow http page changes*

Welcome Page
- login
    - need passwords and usernames to be stored on DB for retrieval or update

    
Employee Page:
- See single reembursements past and pending
- Request Reimbursement
    - amount
    - reason

Manager Page:
- See all past and pending reimbursements
- approve or deny reimbursements
    - send message stating reason for choice

Statistics Page:
- allow manager to see reimburement meta data
    - mean expenditure
    - ordering of employees by reimbursement amount


**DATA**

*Backend Requirements*
- Express
- Cosmos DB
- REST requests

*AZUREDB*
- containers
    - name: login - accounts for all managers and employees which holds PWs, usernames
    - name: data - all data about reimbursements past and pending
    - name: statistics - for manager


**MISC**
DTO's:
- In the field of programming a data transfer object (DTO[1][2]) is an object that carries data between processes. The motivation for its use is that communication between processes is usually done resorting to remote interfaces (e.g., web services), where each call is an expensive operation.[2] Because the majority of the cost of each call is related to the round-trip time between the client and the server, one way of reducing the number of calls is to use an object (the DTO) that aggregates the data that would have been transferred by the several calls, but that is served by one call only.[2]

- htmlFor : added to labels so that they can be linked to buttons

- to make the static website on azure
    - make a container with $name
    - upload, adanvaced, upload to folder, name sstatic
    - add a proxy file and create
    - do this again in the static folder
    - now upload all files into the static subfolder

- to allow a fully deployed website, turn off setting in browser that blocks http vs https

- sessionstorage is only needed for page reloading (cookies)
    - conditional rendering is all that is needed for page rendering

- right click then format document to format json that is all on one line

**Creating a static webpage with Azure Static Web Page**

- go to static web apps on azure
- create static web app
    - orgnaization: git name
    - repo
    - branch: main
    - build preset: react
