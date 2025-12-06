---
description: How to deploy the Password Manager app
---
# Deployment Guide

This application consists of a **Django Backend** and a **Vite/React Frontend**. The recommended way to deploy this for free is using **Render** (for the backend) and **Vercel** (for the frontend).

## Part 1: Deploying the Backend (Django) on Render

1.  **Preparation** (Already done for you):
    *   Currently, `gunicorn` and `whitenoise` are installed.
    *   `requirements.txt` is updated.
    *   `STATIC_ROOT` and `STATICFILES_STORAGE` are configured in `settings.py`.

2.  **Push to GitHub**:
    *   Create a new repository on GitHub.
    *   Initialize git in the root folder (`password_manager`) and push your code.
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin <your-repo-url>
    git push -u origin main
    ```

3.  **Create Service on Render**:
    *   Go to [Render.com](https://render.com) and sign up.
    *   Click "New +" -> "Web Service".
    *   Connect your GitHub repository.
    *   **Settings**:
        *   **Name**: `password-manager-backend` (or similar)
        *   **Root Directory**: `backend`
        *   **Runtime**: Python 3
        *   **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
        *   **Start Command**: `gunicorn config.wsgi:application`
    *   **Environment Variables**:
        *   Key: `PYTHON_VERSION`, Value: `3.11.0` (or similar)
        *   Key: `SECRET_KEY`, Value: `<generate_random_string>`
        *   Key: `DEBUG`, Value: `False`

4.  **Copy the Backend URL**:
    *   Once deployed, Render will give you a URL (e.g., `https://password-manager-backend.onrender.com`).
    *   **Important**: You will need to update `CORS_ALLOW_ALL_ORIGINS` in `settings.py` or keep it `True`, but ideally, you should set `CORS_ALLOWED_ORIGINS` to your frontend URL later.

## Part 2: Deploying the Frontend (React) on Vercel

1.  **Update API URL**:
    *   In `frontend/src/api.js`, you need to change the `baseURL` to your **deployed backend URL**.
    *   *Pro Tip*: Use an environment variable.
    *   Create a file `.env` in `frontend/` (if running locally) or set it in Vercel settings.
    *   Update `api.js`:
        ```javascript
        const api = axios.create({
          baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
        });
        ```

2.  **Deploy on Vercel**:
    *   Go to [Vercel.com](https://vercel.com) and sign up.
    *   Click "Add New..." -> "Project".
    *   Import the same GitHub repository.
    *   **Framework Preset**: Vite
    *   **Root Directory**: `frontend` (Click "Edit" next to Root Directory and select `frontend`).
    *   **Environment Variables**:
        *   Key: `VITE_API_URL`
        *   Value: `https://<your-render-backend-url>/api/` (Don't forget the trailing slash and `/api/`!)
    *   Click **Deploy**.

## Part 3: Final Connection

1.  Once functionality is verified, go back to your **Django settings.py** (or Render Environment Variables) and set specific allowed hosts/cors implications if you want to be strict, but for a personal project, the current settings are fine.
2.  Enjoy your deployed app!
