import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4">
      <div className="rounded-xl shadow-lg p-6 bg-gray-900 bg-opacity-90 backdrop-blur-sm">
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              // Form container
              card: "bg-gray-900 text-white border border-gray-700",
              // Form title & subtitle
              headerTitle: "text-white",
              headerSubtitle: "text-gray-400",
              // Social login buttons (Google, etc.)
              socialButtonsBlockButton:
                "bg-gray-800 text-white hover:bg-gray-700",
              // Input labels
              formFieldLabel: "text-gray-300",
              // Input boxes
              formFieldInput:
                "bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-red-500",
              // Primary submit button
              formButtonPrimary:
                "bg-red-600 hover:bg-red-700 text-white font-semibold",
              // Bottom text and links
              footerActionText: "text-gray-400",
              footerActionLink: "text-red-400 hover:underline",
            },
          }}
        />
      </div>
    </div>
  );
}
