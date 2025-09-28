# Review Platform Frontend

A React-based frontend for the Book Review Platform with automated AWS deployment using S3 and CloudFront.

🔄 **Auto-Deployment Active**: Changes to main branch automatically deploy to production!

## 🚀 Quick Start with CI/CD

**Option 1: Automated Setup (Recommended)**
```bash
# Run the quick setup script
./scripts/quick-setup.sh
```

**Option 2: Manual Setup**
See [CICD_SETUP_GUIDE.md](./CICD_SETUP_GUIDE.md) for detailed instructions.

## 🏗️ Architecture

- **Frontend**: React with TypeScript, Redux, Tailwind CSS
- **Backend Integration**: http://43.205.211.216:5000
- **Deployment**: AWS S3 + CloudFront CDN
- **CI/CD**: GitHub Actions automated deployment

## 📁 Project Structure

```
├── .github/workflows/     # CI/CD pipelines
├── src/                   # React application source
├── terraform/             # AWS infrastructure as code
├── scripts/               # Deployment automation
├── public/                # Static assets
└── build/                 # Production build (generated)
```

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## 🚀 Deployment

### Prerequisites
- AWS Account with appropriate permissions
- GitHub repository
- AWS CLI configured locally
- Terraform installed

### Deployment Options

**1. Quick Setup (Recommended)**
```bash
./scripts/quick-setup.sh
```

**2. Manual Infrastructure Setup**
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
terraform init
terraform apply
```

**3. Manual Frontend Deployment**
```bash
cd scripts
./deploy-frontend.sh --environment dev
```

### GitHub Actions CI/CD

The repository includes automated workflows:
- **Infrastructure Pipeline**: Deploys AWS resources
- **Frontend Pipeline**: Builds and deploys React app

Triggers automatically on push to main branch.

## 🔧 Configuration

### Environment Variables
- `REACT_APP_API_URL`: Backend API endpoint (default: http://43.205.211.216:5000)
- `REACT_APP_ENVIRONMENT`: Current environment (dev/staging/prod)

### Backend Integration
The frontend is configured to communicate with the Book Review Platform API running at `http://43.205.211.216:5000`.

## 📖 Documentation

- [CI/CD Setup Guide](./CICD_SETUP_GUIDE.md) - Complete deployment setup
- [API Integration PRD](./API_INTEGRATION_PRD.md) - API integration details
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - DevOps deployment guide

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
