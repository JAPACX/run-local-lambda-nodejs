## Setup and Installation

0. **To generate ZIP**: this command generate zip file to upload aws lambda in bin folder.

```bash

npm run build

```

1. **Clone the repository**: Clone this repository to your local machine using `git clone <repository-url>`.

2. **Install dependencies**: Navigate to the project root directory and run `npm install` to install the required dependencies.

3. **Start the local server**: Run `npm start` to start the Express server with `nodemon` for automatic reloading. By default, the server runs on `http://localhost:3000`.

## Testing Lambda Functions Locally

To test your Lambda function with a specific event:

1. **Create a JSON file** in the `events` folder with the event data you want to simulate.

2. **Invoke the Lambda function** by sending a GET request to `http://localhost:3000/invoke/<eventName>`, where `<eventName>` is the name of your JSON file without the `.json` extension.

To invoke your Lambda function without an event, simply send a GET request to `http://localhost:3000/invoke`.

## Debugging Your Lambda Function

To debug your Lambda function locally, the `--inspect` flag has been added to the `start` script in the `package.json`. To attach a debugger, you can use Chrome DevTools or your preferred IDE that supports Node.js debugging. After starting your server with `npm start`, run `node attach process` in your terminal. This will allow you to step through the code, inspect variables, and gain insights into the execution flow of your Lambda function simulation.

## Modifying the Lambda Function

The example Lambda function is defined in `lambda.js`. You can modify this file to implement your specific logic. Changes to the Lambda function or the Express server setup will automatically reload the server, thanks to `nodemon`.

## Note on the Lambda Function File

The `lambda.js` file contains the core logic of the Lambda function you're simulating locally. When you're ready to deploy to AWS Lambda, this is the file you should copy to AWS. The reason for this is that `lambda.js` encapsulates the event handler that AWS Lambda invokes in response to triggers, making it the essential component of your Lambda function.

## Contributing

Contributions to improve the local testing setup or the example Lambda function are welcome. Please follow the standard GitHub pull request process to submit your changes.

# run-local-lambda-nodejs
