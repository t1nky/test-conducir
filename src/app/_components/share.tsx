"use client";

import QRCode from "qrcode.react";
import { useQuizStore } from "~/app/_provider/quiz-store-provider";
import lzString from "lz-string";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ShareIcon, XMarkIcon } from "@heroicons/react/24/solid";

const ShareState = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const getSerializedState = useQuizStore((state) => state.getSerializedState);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    const serializedState = getSerializedState();

    const compressedState =
      lzString.compressToEncodedURIComponent(serializedState);
    console.log(compressedState);
    const url = new URL(window.location.origin);
    url.searchParams.set("state", compressedState);
    setShareUrl(url.toString());
  }, []);

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-10"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <ShareIcon
                  aria-hidden="true"
                  className="h-6 w-6 text-blue-600"
                />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <DialogTitle
                  as="h3"
                  className="text-base font-semibold leading-6 text-gray-900"
                >
                  Share progress
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Scan this QR code to share your progress
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-col items-center justify-center gap-4">
              <QRCode value={shareUrl} />
              <button
                onClick={() => {
                  try {
                    navigator.clipboard.writeText(shareUrl);
                  } catch (err) {
                    console.error(shareUrl, err);
                  }
                }}
                className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                Copy URL
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ShareState;
