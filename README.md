# COLORS

COLORS is a small web application for managing a personal list of colors. Users log in, search their saved colors, and add new colors to the collection. The frontend is a set of static HTML, CSS, and JavaScript files that communicates with a PHP LAMP API.

## Technologies Usedd

- HTML5 for the application pages
- CSS3 for styling
- JavaScript and `XMLHttpRequest` for page behavior and API requests
- PHP for the backend API in `LAMPAPI/`
- MySQL-compatible database through the LAMP backend
- Git for version control

## Project Structure

- `index.html`: Login page
- `color.html`: Authenticated color search and add page
- `css/styles.css`: Application styles
- `js/code.js`: Login, session, search, add, and logout behavior
- `js/md5.js`: Included hashing utility
- `LAMPAPI/`: PHP API endpoints for login, adding colors, and searching colors

## Setup

### Frontend

1. Clone or download this repository.
2. Confirm that the API base URL in `js/code.js` points to a running COLORS backend. The current project uses `http://COP4331-5.com/LAMPAPI`.
3. Serve the repository directory with a local web server. For example, with Python installed:

   ```text
   python -m http.server 8000
   ```

4. Open `http://localhost:8000` in a browser.

Opening `index.html` directly from the file system is not recommended because browser security rules may block API requests.
\*\* Originally the colors lab was hosted on a linux server on digital ocean!!!

### Backend

The PHP files in `LAMPAPI/` must be deployed to a PHP-enabled web server with access to the application's database. Configure the database connection and credentials according to the hosting environment, then make the endpoint available at the same path used by `urlBase` in `js/code.js`. The repository does not include database schema or production credentials.

## How to Use the Application

1. Open the frontend at the URL provided by the web server.
2. Enter a valid account username and password on the login page.
3. After successful login, use **Search Color** to find saved colors.
4. Enter a color name and select **Add Color** to save it.
5. Select **Log Out** to end the current session.

## Assumptions and Limitations

- A working PHP API, database, and user account are required for login and color operations.
- The frontend is configured for the hosted API URL in `js/code.js`; local backend deployments require updating that value.
- Login state is stored in a browser cookie that expires after 20 minutes. This is a simple class project session mechanism, not production-grade authentication.
- API requests currently use plain HTTP and should be served over HTTPS in a production environment.
- The application does not provide user registration, color editing, color deletion, or password recovery.
- The repository does not include database setup scripts, production secrets, or a dependency manager.

## AI Usage

Was used to debug and troubleshoot issue in code.

## License

This project is released under the MIT License. See `LICENSE` for details.
