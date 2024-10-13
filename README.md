# Blood Pressure Tracker

A React-based web application for tracking and managing blood pressure readings.

## Features

- **Add, Edit, and Delete Readings**: Users can manage their blood pressure readings easily.
- **Filter Readings**: Filter readings by person (Mother/Father).
- **Date Range Filtering**: View readings within a specific date range.
- **Pagination**: Navigate through readings with pagination.
- **Export to Excel**: Export filtered data to an Excel file.
- **Responsive Design**: Optimized for both mobile and desktop devices.

## Technologies Used

- **Frontend**: React
- **Backend**: Firebase (Firestore)
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Excel Export**: XLSX

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/blood-pressure-tracker.git
   cd blood-pressure-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Add a web app to your Firebase project.
   - Copy the Firebase configuration.
   - Create a `.env` file in the root directory and add your Firebase configuration:
     ```
     REACT_APP_FIREBASE_API_KEY=your_api_key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
     REACT_APP_FIREBASE_PROJECT_ID=your_project_id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     REACT_APP_FIREBASE_APP_ID=your_app_id
     ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## Deployment

To build the app for production, run:

```bash
npm run build
```

This will create a `build` folder with the production-ready files. You can then deploy this folder to your preferred hosting service.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).