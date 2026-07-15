"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    AccessDenied: "You don't have permission to access this resource",
    Callback: "There was an error during the callback",
    OAuthSignin: "Error signing in with Discord",
    OAuthCallback: "Error during OAuth callback",
    OAuthCreateAccount: "Could not create user account",
    EmailCreateAccount: "Could not create user with email",
    Callback: "Error in the OAuth callback",
    EmailSignInError: "Email sign in error",
    CredentialsSignin: "Sign in credentials were not valid",
    default: "An authentication error occurred",
  };

  const message = errorMessages[error as string] || errorMessages.default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary to-background">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="bg-secondary rounded-lg shadow-xl p-8 border border-gray-700">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>

          <h1 className="text-2xl font-bold text-center text-white mb-2">
            Authentication Error
          </h1>

          <p className="text-gray-400 text-center mb-6">
            {message}
          </p>

          {error && (
            <p className="text-gray-500 text-center text-sm mb-6 font-mono">
              Error: {error}
            </p>
          )}

          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full text-center bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Try Again
            </Link>

            <Link
              href="https://discord.gg/titanbot"
              className="block w-full text-center bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Get Help
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
