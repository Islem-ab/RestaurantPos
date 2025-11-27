import Toast from "react-native-toast-message";

export function toastSuccess(message: string) {
  Toast.show({
    type: "success",
    text1: message,
    position: "top",
    visibilityTime: 1500,
  });
}

export function toastError(message: string) {
  Toast.show({
    type: "error",
    text1: message,
    position: "top",
    visibilityTime: 2000,
  });
}

export function toastInfo(message: string) {
  Toast.show({
    type: "info",
    text1: message,
    position: "top",
    visibilityTime: 1500,
  });
}
