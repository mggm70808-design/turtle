"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary to-background">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="bg-secondary rounded-lg shadow-xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">TitanBot</h1>
            <p className="text-gray-400">Dashboard</p>
          </div>

          <div className="space-y-4">
            <p className="text-gray-300 text-center text-sm">
              Sign in with your Discord account to manage your servers
            </p>

            <button
              onClick={() =>
                signIn("discord", { callbackUrl: "/dashboard" })
              }
              className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.317 4.3671a19.8067 19.8067 0 00-4.8851-1.5152.074.074 0 00-.0787.0366c-.211.3667-.444.8465-.607 1.2251a18.285 18.285 0 00-5.487 0c-.163-.3786-.395-.8584-.607-1.2251a.077.077 0 00-.0787-.0366 19.7463 19.7463 0 00-4.8852 1.5152.07.07 0 00-.0327.0277C.533 9.046.332 13.58.997 18.057a.082.082 0 00.0328.056c2.7 1.9282 5.3 3.0955 7.865 3.869a.08.08 0 00.087-.0328c.462-.612.873-1.256 1.226-1.933a.079.079 0 00-.044-.11 13.228 13.228 0 01-1.885-.892.081.081 0 01-.008-.135c.126-.094.252-.192.372-.291a.077.077 0 01.08-.01c3.928 1.793 8.18 1.793 12.062 0a.077.077 0 01.083.011c.12.099.246.197.372.291a.081.081 0 01-.005.135c-.603.39-1.233.645-1.885.89a.08.08 0 00-.041.11c.36.677.77 1.322 1.226 1.933a.08.08 0 00.088.028c2.567-.868 5.266-1.99 7.965-3.869a.083.083 0 00.033-.056c.73-4.604.076-8.602-.704-12.042a.074.074 0 00-.031-.03zM8.02 15.331c-1.182 0-2.157-.965-2.157-2.156 0-1.193.964-2.157 2.157-2.157 1.192 0 2.156.964 2.157 2.157 0 1.19-.965 2.156-2.157 2.156zm7.975 0c-1.183 0-2.157-.965-2.157-2.156 0-1.193.964-2.157 2.157-2.157 1.192 0 2.157.964 2.157 2.157 0 1.19-.965 2.156-2.157 2.156z" />
              </svg>
              Sign in with Discord
            </button>
          </div>

          <div className="mt-8 text-center text-xs text-gray-500">
            <p>By signing in, you agree to our Terms of Service</p>
          </div>
        </div>
      </div>
    </div>
  );
}
