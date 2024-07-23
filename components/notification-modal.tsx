"use client";

import { createPortal } from "react-dom";
import toast from "react-hot-toast";

interface NotificationModalProps {
  onRequestClose: (granted: boolean) => void;
  saveSubscription: () => void;
}

const NotificationModal = ({
  onRequestClose,
  saveSubscription,
}: NotificationModalProps) => {
  const requestNotificationPermission = async () => {
    if ("Notification" in window && "serviceWorker" in navigator) {
      const permission = await Notification.requestPermission();
      onRequestClose(permission === "granted");
      if (permission === "granted") {
        saveSubscription();
      }
    } else {
      toast.error(
        "Aviseringar stöds inte i den här webbläsaren eller något har gått fel. "
      );
    }
  };

  return createPortal(
    <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="font-bold text-xl mb-4">
          Tillåt att skicka push-meddelanden.
        </h2>
        <p className="mb-4">
          Ta emot aviseringar från AI:n när nya träningspass är tillgängliga.
        </p>
        <button
          className="bg-yellow-500 text-white py-2 px-4 rounded-lg"
          onClick={requestNotificationPermission}
        >
          Tillåt
        </button>
        <button
          className="ml-4 py-2 px-4 rounded-lg"
          onClick={() => onRequestClose(false)}
        >
          Stäng
        </button>
      </div>
    </div>,
    document.body
  );
};

export default NotificationModal;
