import { ref, watch } from "vue";
import { v4 } from "uuid";

export interface DataTrackingOptions {
  optOutKey: string;
  userIDKey: string;
  apiUrl?: string;  // Allow setting this for e.g. testing with a local server
  storyPath: string;
  resetData: () => void;
  getData: () => Record<string, unknown>;
}

export function useDataTracking(options: DataTrackingOptions) {

  const apiUrl = options.apiUrl ?? "https://api.cosmicds.cfa.harvard.edu";
  const storyDataUrl = `${apiUrl}${options.storyPath}/data`;
  const storedOptOut = window.localStorage.getItem(options.optOutKey);
  const responseOptOut = ref(typeof storedOptOut === "string" ? storedOptOut === "true" : null);

  const vite = import.meta && import.meta.env;
  const env = vite ? import.meta.env : process.env;
  const prefix = vite ? "VITE_" : "VUE_APP_";

  const maybeUserID = window.localStorage.getItem(options.userIDKey);
  const existingUser = maybeUserID !== null;
  const userID = maybeUserID ?? v4();
  if (!existingUser) {
    window.localStorage.setItem(options.userIDKey, userID);
  }
  
  const headers = {
    "Content-Type": "application/json",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "Authorization": env[`${prefix}CDS_API_KEY`] ?? "",
  };

  watch(responseOptOut, (optOut: boolean | null) => {
    if (optOut !== null) {
      window.localStorage.setItem(options.optOutKey, String(optOut));
    }
  });

  async function createUserEntry() {
    if (responseOptOut.value) {
      return;
    }

    const existsResponse = await fetch(`${storyDataUrl}/${userID}`, {
      method: "GET",
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers,
    });
    const content = await existsResponse.json();
    const exists = existsResponse.status === 200 && content.response.user_uuid !== undefined;
    if (exists) {
      return;
    }

    fetch(storyDataUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        user_uuid: userID,
      }),
    });
  }

  function updateUserData() {
    if (responseOptOut.value) {
      return;
    }

    const data = options.getData();
    fetch(`${storyDataUrl}/${userID}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
      keepalive: true,
    }).then(() => options.resetData());
  }

  // If the user needs to explicitly disable this for some reason,
  // it's going to be a lot easier to do if they have a reference to the listener function
  function visibilityChangeListener() {
    if (document.visibilityState === "hidden") {
      updateUserData();
    } else {
      options.resetData();
    }
  }
  
  window.addEventListener("visibilitychange", visibilityChangeListener);

  return {
    userID,
    createUserEntry,
    updateUserData,
    visibilityChangeListener,
  };
}
