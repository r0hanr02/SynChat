import { toast } from "react-toastify";

const showSuccess = (message) => {
  toast.success(message);
};
const showError = (message) => {
  toast.error(message);
};

export { showSuccess, showError };
