import { BrowserRouter } from "react-router-dom";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import store from "@store/store";
import { swEnvVariables, environment } from "@api/environment";
import markerSDK from "@marker.io/browser";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import SentryRRWeb from "@sentry/rrweb";
import { createRoot } from "react-dom/client";
import { ensureVariablesExist } from "@utils/env";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import SwTheme from "./theme/theme";
import CssBaseline from "@mui/material/CssBaseline";

// markerSDK.loadWidget({
//   destination: `${process.env.REACT_APP_MARKER}`,
//   reporter: {
//     email: "frontend@aut.id",
//     fullName: "Āut Integrate"
//   }
// });

// Sentry.init({
//   dsn: `https://e8018550ad7742088d62be4084909caf@o1432500.ingest.sentry.io/${process.env.REACT_APP_SENTRY}`,
//   integrations: [new BrowserTracing(), new SentryRRWeb({})],
//   tracesSampleRate: 1.0
// });

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={SwTheme}>
      <CssBaseline />
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </StyledEngineProvider>
);

ensureVariablesExist(environment, swEnvVariables);
reportWebVitals(null);
