import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4">
      <div className="rounded-xl shadow-lg p-6 bg-gray-900 bg-opacity-90 backdrop-blur-sm">
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          appearance={{
            elements: {
              // Main card container
              card: "bg-gray-900 text-white border border-gray-700",
              // Title and subtitle
              headerTitle: "text-white",
              headerSubtitle: "text-gray-400",
              // Social buttons
              socialButtonsBlockButton:
                "bg-gray-800 text-white hover:bg-gray-700",
              // Labels for inputs
              formFieldLabel: "text-gray-300",
              // Input fields
              formFieldInput:
                "bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-red-500",
              // Submit button
              formButtonPrimary:
                "bg-red-600 hover:bg-red-700 text-white font-semibold",
              // Footer links and text
              footerActionText: "text-gray-400",
              footerActionLink: "text-red-400 hover:underline",
            },
          }}
        />
      </div>
    </div>
  );
}
