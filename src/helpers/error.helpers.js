import { notification } from "antd";

/**
 * Render error notifications.
 *
 * @param {Array<{ message: string }>} [errors=[]] - An array of error objects.
 */

export const renderErrorNotifications = (errors) => {
  if (Array.isArray(errors)) {
  errors?.forEach((errorMessage) => {
    let description = "";

    if (errorMessage.rawErrors) {
      description = errorMessage.rawErrors
        .map((rawErr) => rawErr.message)
        .join(" | ");
    }

    notification.error({
      message: errorMessage?.message,
      description: description,
      placement: "topRight",
      duration: 5,
    });
    });
  } else {
    notification.error({
      message: errors,
      placement: "topRight",
      duration: 5,
    });
  }
};

export const renderSuccessNotifications = ({ title, message }) => {
  notification.success({
    message: title,
    description: message,
    placement: "topRight",
    duration: 5,
  });
};
