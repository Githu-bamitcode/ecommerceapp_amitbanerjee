import React from "react";

const Verify = () => {
  return (
    <div className="relative w-full h-190 overflow-hidden">
      <div className="min-h-screen flex items-center justify-center bg-ping-100 px-4">
        <div className="bg-white p-8 rounded-2x1 shadow-lg w-full max-w-md text-center">
          <h2 className="text-2x1 font-semibold text-green-500 mb-4">
            ✅ Check Your Email
          </h2>
          <p className="text-grey-400 text-sm">
            We've sent you an email to verify your account. Please check your
            Inbox and click on the Verification link
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verify;
