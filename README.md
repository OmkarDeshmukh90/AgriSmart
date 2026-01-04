![Open Source](https://img.shields.io/badge/open--source-yes-brightgreen)
![Platform](https://img.shields.io/badge/platform-android-green)
![Built with Flutter](https://img.shields.io/badge/built%20with-Flutter-blue)
![Status](https://img.shields.io/badge/status-MVP%20Development-orange)

🌾 AgriSmart — Smart Farming Assistant

AgriSmart is a mobile-first agriculture super-app designed to guide farmers through the entire crop lifecycle—from crop selection to harvesting and selling—using data-driven insights and simple daily actions.

The platform integrates location, soil information, weather forecasts, and market prices to recommend the most suitable crops for a farmer’s land. Once a crop is selected, AgriSmart generates a stage-wise crop plan and delivers timely advisories for sowing, irrigation, fertilization, pest management, and harvesting.

AgriSmart is built with an offline-first approach, optimized for low-bandwidth environments, and supports multiple Indian languages, making it accessible to farmers with limited internet access and digital literacy.

🚀 Key Features

🌱 Crop Recommendation Engine
Suggests the best crops based on location, soil parameters, season, and weather forecast.

📅 Crop Lifecycle Planning
Auto-generated crop calendar with stage-wise guidance.

✅ Daily Task & Advisory System
Actionable reminders for farming activities.

🌦️ Weather Intelligence
Weather alerts translated into clear farming actions.

💰 Market & Mandi Price Insights
Nearby mandi prices, trends, and sell-decision support.

📶 Offline-First Mobile Experience
Access crop plans and tasks even without internet.

🌐 Multi-Language Support
Designed for Indian farmers (Hindi, Marathi, English).

🎯 Problem Statement

Farmers often rely on fragmented, delayed, or informal information when making crop and selling decisions. This results in:

Poor crop selection

Inefficient farm operations

Higher risk from weather uncertainty

Lower income due to unfavorable market timing

💡 Solution

AgriSmart unifies agronomy guidance, weather intelligence, and market insights into a single mobile platform that provides timely, practical, and easy-to-follow guidance, helping farmers:

Choose the right crop

Take the right action at the right time

Sell produce at better prices

🏗️ System Architecture (High Level)
Mobile App (Flutter)
      |
      v
Backend APIs (Planned)
      |
      v
External Data Sources
- Weather APIs
- Soil Data
- Mandi Price Data


The architecture is modular and designed to scale into an AI-enabled agriculture ecosystem.

🛠️ Tech Stack
Frontend

Flutter (Android-first)

Offline storage (SQLite / local cache)

Multi-language support (i18n)

Backend (Planned)

REST APIs (FastAPI / Django)

PostgreSQL (structured data)

Redis (caching)

Data Sources

Weather APIs

Government soil datasets

Mandi / market price data

🧪 MVP Scope

The current MVP focuses on:

Crop recommendations (rule-based)

Crop lifecycle planning

Daily task reminders

Weather and market alerts

Offline usability

Advanced AI, direct marketplace integration, and financial services are planned for future phases.

📦 Project Status

🚧 Under Active Development (MVP Stage)

This repository contains:

Product design references

UI/UX flows

Initial Flutter implementation (in progress)

## Screenshots

<img width="216" height="432" alt="Screenshot 2026-01-05 030209" src="https://github.com/user-attachments/assets/cada0a22-b95f-411d-a409-7723a5376f73" />
<img width="216" height="432" alt="Screenshot 2026-01-05 030319" src="https://github.com/user-attachments/assets/b355dde7-a6a8-4fc3-a0e4-849ccefa1d04" />
<img width="216" height="432" alt="Screenshot 2026-01-05 030250" src="https://github.com/user-attachments/assets/23cb9fe8-cb0e-494c-acaa-e8e6aab9c090" />


🗺️ Roadmap

Phase 1: MVP pilot with limited crops and regions

Phase 2: Multi-crop, multi-region expansion

Phase 3: AI-driven advisory and ecosystem integrations

🤝 Contributing

Contributions are welcome!
If you’d like to contribute:

Fork the repository

Create a feature branch

Submit a pull request

Please keep the code modular and well-documented.

📄 License

This project is currently under development.
License details will be added before public release.

📬 Contact

For collaboration, feedback, or suggestions:

Author: Omkar Deshmukh

Location: India

🌟 Vision

To empower farmers with timely knowledge, confident decisions, and fair market access through simple and trusted digital tools.
