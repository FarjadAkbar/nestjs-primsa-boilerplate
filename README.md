<a href="https://www.koderlabs.com/" target="_blank" rel="noopener">
<img src="https://www.koderlabs.com/assets/img/logo/new-logo.png" title="koderlabs" />
</a>

# APIs - Boilerplate

This boilerplate comprise following modules:
## Modules
- Slide Authentication
- Social Login/Signup Integration 
- Chat
- Push Notifications
- Docusign (E-signature)
- Stripe Integration
- Paypal Integration
- InApp Purchase
- Image Resizing/File Compression
- Document Managment (Media Uploading/Pdf,Csv)
- Language Localization
- Ride Tracking
- RBAC and RPBAC (Role and Permissions)
- Ecommerce (Multi Vendor System)

Note: Language Localization has added in each module(i18n).

## Prerequisites
- node >= 16.18.1
- npm  >= 8.19.1
- docker >= 20.10.0

## Tech Stack

-   [NestJS](https://docs.nestjs.com/)
-   [Typescript](https://www.typescriptlang.org/docs/handbook/)
-   [Prisma](https://www.prisma.io/docs/)

## Installation

```
npm install
```

## Running the app

-   Copy `.env.example` to `.env`
-   Here is the sample `.env` file:

## Environment Variables

To run all features of this boilerplate, you will need to add the following environment variables to your env file.

```
APP_PORT=3011
APP_DEBUG=true
APP_LOG_LEVEL=10

APP_DATABASE_URL="postgresql://postgres:click123@localhost:5432/api_db?schema=public"

APP_REDIS_HOST=localhost
APP_REDIS_PORT=6379

APP_TOKEN_EXPIRATION=604800 # 7 days

APP_AWS_ACCESS_KEY=
APP_AWS_SECRET_KEY=
APP_AWS_REGION=
APP_AWS_BUCKET=
APP_AWS_BUCKET_BASE_URL=
APP_AWS_STS_ROLE_ARN=
APP_AWS_QUEUE_URL=
APP_AWS_SES_FROM_EMAIL=

APP_GOOGLE_OAUTH_ENDPOINT=
APP_APPLE_OAUTH_ENDPOINT=

APP_DOCUSIGN_ACCOUNT_ID=
APP_DOCUSIGN_OAUTH_BASE_URL=
APP_DOCUSIGN_OAUTH_CALLBACK_URL=
APP_DOCUSIGN_BASE_URL=
APP_DOCUSIGN_INTEGRATION_KEY=
APP_DOCUSIGN_SECRET_KEY=
# you can replace WEB_RETURN_URL with RETURN_URL
APP_DOCUSIGN_WEB_RETURN_URL= 
APP_DOCUSIGN_WEBHOOK_SECRET=

APP_IAP_GOOGLE_EMAIL=
APP_IAP_GOOGLE_SECRET_KEY=
APP_IAP_ANDROID_PACKAGE_NAME=
APP_IAP_APPLE_SECRET_KEY=

APP_STRIPE_SECRET_KEY=
APP_STRIPE_CURRENCY=
APP_STRIPE_WEBHOOK_KEY=

APP_PAYPAL_CLIENT_ID=
APP_PAYPAL_CLIENT_SECRET=
APP_PAYPAL_ENVIRONMENT=
APP_PAYPAL_WEBHOOK_ID=
APP_PAYPAL_RETURN_URL=
APP_PAYPAL_CANCEL_URL=

APP_FIREBASE_PROJECT_ID=
APP_FIREBASE_PRIVATE_KEY=
APP_FIREBASE_CLIENT_EMAIL=

APP_TWILIO_ACCOUNT_SID=
APP_TWILIO_AUTH_TOKEN=
APP_TWILIO_FROM_NUMBER=
```
You must have docker installed on your system before running these commands.

-   Start PostgreSQL and Redis docker container

```
docker volume create --name=api_postgres_data
docker volume create --name=api_redis_data
docker compose up -d
```
Make sure your database connection string syntax is same as above sample APP_DATABSE_URL, then run these commands.

-   Run the migrations

```
npm run db:migrate
```

-   Generate typings for the schema.prisma file

```
npm run db:generate
```

-   Seed kickoff data to your database

```
npm run db:seed
```

## Start the application

```
npm run start:dev
```

## Swager

Visit the following link after starting your application to see the Swagger documentation:

[Swagger](http://localhost:3011/v1/api)

## Deploying code on an AWS EC2 instance

Please create an EC2 instance with the following AMI that has all the pre-requisites installed

[node-docker-nginx-ami](https://us-east-1.console.aws.amazon.com/ec2/home?region=us-east-1#ImageDetails:imageId=ami-0e3e8d17e834d404c)
