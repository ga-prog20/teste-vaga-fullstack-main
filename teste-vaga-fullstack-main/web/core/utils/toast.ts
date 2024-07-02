import { message } from "antd";

function showToast<
  mToast extends { status: boolean; text: string; duration: number }
>(params: mToast) {
  if (params.status) {
    if (params.status) {
      message.open({
        type: "success",
        content: params.text,
        duration: params.duration,
      });
    } else {
      message.open({
        type: "error",
        content: params.text,
        duration: params.duration,
      });
    }
  } else {
    message.open({
      type: "error",
      content: params.text,
      duration: params.duration,
    });
  }
}

export default showToast;
