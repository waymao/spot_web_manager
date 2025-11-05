# ROS Topic Subscriber & Service Caller - React Application

A modular React application for subscribing to ROS topics and calling ROS services via rosbridge.

## Project Structure

```
spot_rosbridge_web/
├── src/
│   ├── components/           # Reusable React components
│   │   ├── ConnectionPanel.jsx
│   │   ├── Tabs.jsx
│   │   ├── SearchBox.jsx
│   │   ├── TopicsList.jsx
│   │   ├── MessageViewer.jsx
│   │   ├── ServicesList.jsx
│   │   └── ServiceCaller.jsx
│   ├── hooks/                # Custom React hooks
│   │   ├── useRosConnection.js
│   │   ├── useTopics.js
│   │   └── useServices.js
│   ├── App.jsx               # Main application component
│   ├── App.css               # Application styles
│   └── main.jsx              # Application entry point
├── index.html                # HTML template
├── package.json              # Dependencies and scripts
└── vite.config.js            # Vite configuration

```

## Features

- **Modular Architecture**: Components are separated by concerns (UI, ROS logic, state management)
- **Custom Hooks**: Reusable hooks for ROS connection, topics, and services
- **Real-time Updates**: Live topic subscription and message display
- **Service Calling**: Call ROS services with JSON request payloads
- **Search & Filter**: Search through topics and services
- **Responsive UI**: Clean, modern interface with visual feedback

## Installation

```bash
npm install
```

## Usage

### Development

```bash
npm run dev
```

The application will start on [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Components

### UI Components

- **ConnectionPanel**: Handles ROS connection configuration and status
- **Tabs**: Tab navigation between Topics and Services views
- **SearchBox**: Reusable search input component

### ROS Components

- **TopicsList**: Displays available ROS topics with search and selection
- **MessageViewer**: Shows real-time messages from subscribed topics
- **ServicesList**: Displays available ROS services with search and selection
- **ServiceCaller**: Interface for calling ROS services with JSON payloads

### Custom Hooks

- **useRosConnection**: Manages ROS connection state and lifecycle
- **useTopics**: Fetches and manages ROS topics
- **useServices**: Fetches and manages ROS services

## Configuration

Default rosbridge server URL: `ws://128.148.138.233:9090`

You can change this in the connection panel when running the application.

## Technologies Used

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **roslib.js**: ROS client library for web browsers
- **Vanilla CSS**: Simple, maintainable styling

## Migrating from HTML

This React application is a modular version of `test_rosbridge_standalone.html`. The functionality remains the same, but the code is now:

- Split into reusable components
- Uses React hooks for state management
- Easier to maintain and extend
- Better separation of concerns
- Type-safe component props
