# Movie App

A movie browsing app powered by the TMDB API with authentication, wishlists, search, dark mode, and full Arabic/English localization.

**Live:** [https://react-movie-app-nine-iota.vercel.app/](https://react-movie-app-nine-iota.vercel.app/)

## Features

- Browse Now Playing movies with genre filters (19 genres) and sort (popularity, rating, release date)
- Search movies with debounced live autocomplete suggestions and full paginated results
- Movie detail pages with poster, backdrop, trailer (YouTube), ratings, and recommendations
- Wishlist — add/remove movies with a heart toggle, persisted in localStorage, count badge in navbar
- Authentication via Clerk (Google/GitHub OAuth + email/password) with local fallback
- Protected routes (/wishlist, /account) redirect unauthenticated users to /login
- Account page with email, username, dark mode toggle, and logout
- Dark/light theme — respects system preference, persisted in localStorage, toggle in navbar
- Full internationalization (English / Arabic) with RTL layout support
- Responsive design with Tailwind CSS, loading skeletons, toast notifications, and scroll-to-top

## Screens

| Route | Page |
|---|---|
| `/` | Home — Now Playing movies with genre + sort filters |
| `/search?query=` | Search results |
| `/movie/:id` | Movie details, trailer, recommendations |
| `/wishlist` | Saved movies (auth required) |
| `/account` | Profile, theme toggle, logout (auth required) |
| `/login` | Sign in (email/password or Google/GitHub) |
| `/register` | Create account |
| `*` | 404 Not Found |

## Tech Stack

React 18, Vite 6, React Router v7, TanStack React Query, Tailwind CSS 4, shadcn/ui, Clerk, Zod, React Hook Form

## Quick Start

```bash
git clone <repo-url>
cd movie_app
npm install
```

Create a `.env` file:

```
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key  # optional
```

```bash
npm run dev
```
