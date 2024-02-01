# miniCalgaryBusMap

MiniCalgaryBusMap is a dynamic, real-time bus map application that tracks and showcases the current locations of buses within Calgary. By utilizing relevant data provided by the City of Calgary, this application combines the power of JavaScript and Java to deliver an interactive and user-friendly map interface. Users can easily monitor bus movements, and access transportation information through this application.

![miniCalgaryBusMap Demo](demo.png)

## Features
- Real-time bus location tracking in Calgary
- Interactive bus map using Mapbox
- Data sourced from the City of Calgary
- The map theme and light preset now adapt dynamically based on the current time

## Technologies
### Frontend
- JavaScript
  - Mapbox GL JS library

### Backend
- Java
  - Spring Boot
  - MyBatis
  - Gradle

## Getting Started
To set up miniCalgaryBusMap on your local machine, follow these instructions:

### Prerequisites
- Mapbox account and API key
- Open Weather account and API key

### Installation
1. Clone the repository

git clone https://github.com/yourusername/miniCalgaryBusMap.git



2. Change to the project's root directory

cd miniCalgaryBusMap/



3. Install the required npm dependencies

npm install



4. Set your API keys
- Add your API keys in the "frontend/config.js" as follows:

mapboxAccessToken: your api key,
openWeatherToken: your api key,
mapboxStyle: your api key,



5. Run the application

./gradlew bootRun



6. Open your browser and navigate to `http://localhost:5500/` to access the miniCalgaryBusMap.