"use client";

import { useSignMessage } from "@privy-io/react-auth";

function SignMessageButton() {
  const { signMessage } = useSignMessage();

  return (
    <button
      onClick={async () => {
        try {
          const { signature } = await signMessage(
            { message: "Sign in to Forma Network" },
            {
              uiOptions: {
                title: "Confirm Signature",
                description: "Please sign this message to verify your identity.",
                buttonText: "Sign & Continue",
              },
            },
          );
          console.log("Signature:", signature);
        } catch (error) {
          console.error("Signing failed:", error);
        }
      }}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
    >
      Sign Message
    </button>
  );
}

export default SignMessageButton;
