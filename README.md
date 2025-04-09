# SuperYacht Demo Application

This project is a demo application for managing yacht positions using the SuperYacht Times API. The application allows users to log in using OAuth2, search for yachts, view yacht details, and add positions to yachts on a map.

## Table of Contents

1. [Overview](#overview)
2. [Technologies Used](#technologies-used)
3. [Features](#features)
   - [Login](#login)
   - [Yacht Search](#yacht-search)
   - [Yacht Detail Page](#yacht-detail-page)
   - [Add Position](#add-position)
4. [How to Run the Project](#how-to-run-the-project)
5. [Future Enhancements](#future-enhancements)

---

## Overview

This project demonstrates the functionality of interacting with the SuperYacht Times API. It allows users to:

- Log in using OAuth2.
- Search for yachts based on various parameters.
- View detailed information about a selected yacht.
- Add new position data to yachts on a map.

The application uses modern technologies like **Next.js**, **TypeScript**, **React**, **Leaflet**, and **OAuth2** for a smooth user experience and effective state management.

---

## Technologies Used

- **Next.js**: A React framework for building server-side rendered applications and static websites. I used Next.js for routing and rendering components dynamically.
- **TypeScript**: A superset of JavaScript that adds static types. TypeScript helps ensure better maintainability and catch bugs early.
- **OAuth2**: For authentication with the SuperYacht API. It allows secure access to the API without exposing sensitive credentials.
- **React**: A JavaScript library for building user interfaces. I used React to handle the user interactions and state management.
- **Leaflet**: A library for creating interactive maps. It’s used in the application to show yacht positions on a map.
- **ShadCN**: For UI components like modals and buttons, which provide a consistent and responsive design.

---

## Features

### Login

- **Why?**: The login process uses OAuth2 for secure authentication. OAuth2 is the industry-standard protocol for authorization, ensuring that users can access the application without exposing sensitive credentials.
- **How?**: I used the **SuperYacht Times API**'s OAuth2 implementation to authenticate users. After the user logs in, their token is stored in `localStorage` to persist the session across pages.
- **Technology**: **Next.js API routes** handle the OAuth2 callback and redirect the user to the appropriate page.

### Yacht Search

- **Why?**: The yacht search feature allows users to find yachts based on search parameters like name, type, or location. This feature provides an efficient way to browse the available yachts.
- **How?**: I used the **SuperYacht Times API** to fetch yacht data, passing query parameters like yacht type and location. The data is displayed on a search page where users can easily filter and find the yachts they’re looking for.
- **Technology**: The page is rendered using **Next.js** with **TypeScript** for type safety. **React** manages the state and rendering of the search results.

### Yacht Detail Page

- **Why?**: After a user selects a yacht from the search results, they need detailed information about it. This page provides key details such as the yacht's specifications, location, and images.
- **How?**: The yacht details are fetched from the **SuperYacht Times API** using the yacht’s ID. A modal with a map feature is used to show the yacht’s position on a map, with options to add new positions.
- **Technology**: I used **React Context** for global state management and **Leaflet** for displaying the yacht's position on the map. **ShadCN** is used for the modal and UI components.

### Add Position

- **Why?**: The add position feature allows users to update the location of a yacht by placing a pin on the map. This is useful for tracking yacht positions over time.
- **How?**: When the user clicks on the map, the `useMapEvents` hook captures the coordinates and updates the position. The new position is sent to the **SuperYacht Times API** for storage.
- **Technology**: The map is created using **Leaflet** and the **react-leaflet** library to integrate the map functionality with React. **ShadCN** is used for the modal dialog, and the position is sent to the backend via a POST request.

---
