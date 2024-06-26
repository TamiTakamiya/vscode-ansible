import { AxiosError } from "axios";

export function retrieveError(err: AxiosError): string {
  if (err && "response" in err) {
    if (err?.response?.status === 401) {
      return "User not authorized to access Ansible Lightspeed.";
    } else if (err?.response?.status === 429) {
      return "Too many requests to Ansible Lightspeed. Please try again after some time.";
    } else if (err?.response?.status === 400) {
      const responseErrorData = <AxiosError<{ message?: string }>>(
        err?.response?.data
      );
      if (
        responseErrorData &&
        responseErrorData.hasOwnProperty("message") &&
        responseErrorData.message?.includes("Cloudflare")
      ) {
        return `Cloudflare rejected the request. Please contact your administrator.`;
      } else {
        return "Bad Request response. Please try again.";
      }
    } else if (err?.response?.status === 403) {
      if (
        (err?.response?.headers["server"] || "").toLowerCase() === "cloudfront"
      ) {
        return (
          "Something in your editor content has caused your inline suggestion request to be blocked. \n" +
          "Please open a ticket with Red Hat support and include the content of your editor up to the \n" +
          "line and column where you requested a suggestion."
        );
      } else {
        const responseErrorData = <AxiosError<{ message?: string }>>(
          err?.response?.data
        );
        if (
          responseErrorData &&
          responseErrorData.hasOwnProperty("message") &&
          responseErrorData.message?.includes("WCA Model ID is invalid")
        ) {
          return `Model ID is invalid. Please contact your administrator.`;
        } else if (responseErrorData) {
          switch (
            responseErrorData.hasOwnProperty("code") &&
            responseErrorData.code
          ) {
            case "permission_denied__org_ready_user_has_no_seat": {
              return "You do not have a licensed seat for Ansible Lightspeed and your organization is using the paid commercial service. Contact your Red Hat Organization's administrator for more information on how to get a licensed seat.";
            }
            case "permission_denied__org_not_ready_because_wca_not_configured": {
              return "Contact your administrator to configure IBM watsonx Code Assistant model settings for your organization.";
            }
            case "permission_denied__user_trial_expired": {
              return "Your trial to the generative AI model has expired. Refer to your IBM Cloud Account to re-enable access to the IBM watsonx Code Assistant by moving to one of the paid plans.";
            }
            case "permission_denied__user_with_no_seat": {
              return "You don't have access to IBM watsonx Code Assistant. Contact your administrator.";
            }
            default: {
              return "User not authorized to access Ansible Lightspeed.";
            }
          }
        } else {
          return "User not authorized to access Ansible Lightspeed.";
        }
      }
    } else if (err?.response?.status.toString().startsWith("5")) {
      return "Ansible Lightspeed encountered an error. Try again after some time.";
    } else {
      return `Failed to fetch inline suggestion from Ansible Lightspeed with status code: ${err?.response?.status}. Try again after some time.`;
    }
  } else if (err.code === AxiosError.ECONNABORTED) {
    return "Ansible Lightspeed connection timeout. Try again after some time.";
  } else {
    return "Failed to fetch inline suggestion from Ansible Lightspeed. Try again after some time.";
  }
}
