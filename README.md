# FlavorFind - A Manifest-Powered Recipe App

Welcome to FlavorFind, a complete full-stack recipe sharing application built entirely with React and Manifest.

This application demonstrates a sophisticated backend-first development approach. The Manifest backend defines the data schema, relationships, and access policies, while the React frontend is intelligently generated to utilize those specific backend features.

## Core Features

- **User Authentication**: Secure sign-up and login for chefs.
- **Role-Based Access**: Distinct roles for `chef` and `admin` with different permissions.
- **Recipe Management**: Chefs can create, read, update, and delete their own recipes.
- **Dynamic Ingredient System**: Admins manage a central list of ingredients.
- **Advanced Frontend Components**:
  - **Image Uploader**: Drag-and-drop with previews for recipe photos.
  - **Choice Selector**: Tag-style buttons for recipe difficulty.
  - **Relationship Picker**: An autocomplete search to link ingredients to recipes.
  - **Role-Aware UI**: Admin-only features are hidden from regular users.

## Tech Stack

- **Backend**: Manifest (YAML-based schema)
- **Frontend**: React.js, Tailwind CSS
- **SDK**: `@mnfst/sdk` for all backend communication
- **Icons**: Heroicons

## Getting Started

### Prerequisites

- Node.js and npm/yarn installed.
- A running Manifest backend instance.

### Running the Frontend

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Configure Backend URL**:
    Update `src/constants.js` with the URL of your deployed Manifest backend.

3.  **Start the development server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Admin Access

- Access the auto-generated admin panel at `{YOUR_BACKEND_URL}/admin`.
- Default credentials: `admin@manifest.build` / `admin`
- Use the admin panel to manage users, ingredients, and all recipes.
