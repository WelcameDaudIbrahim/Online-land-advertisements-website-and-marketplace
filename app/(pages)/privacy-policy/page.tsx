import Link from "next/link";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};
export default function page() {
  return (
    <div className="mx-8 mt-4">
      <h1 className="text-primary font-bold text-4xl text-center tracking-wider mt-1.5 mb-6">
        Privacy Policy
      </h1>
      <p className="text-black tracking-wide text-lg mb-2.5 mt-1 mx-2.5">
        At Bdlord, we prioritize the protection of your personal information
        when you use our website (
        <Link href="https://bdlord.com" className="text-primary">
          https://bdlord.com
        </Link>
        ) and related services. We are committed to safeguarding your privacy
        and ensuring your data is handled securely and responsibly.
      </p>
      <h2 className="text-3xl text-center font-bold tracking-wider mt-8 mb-1.5">
        Personal Information Collection
      </h2>
      <p className="text-black tracking-wide text-lg mb-2.5 mt-1 mx-2.5">
        We collect personal information such as your name, phone number, email
        address, and home address when you voluntarily provide it through forms
        on our website, such as when you contact us or subscribe to updates.
        This helps enhance your experience on Bdlord.
      </p>
      <h2 className="text-3xl text-center font-bold tracking-wider mt-8 mb-1.5">
        Cookies
      </h2>
      <p className="text-black tracking-wide text-lg mb-2.5 mt-1 mx-2.5">
        Cookies are small data files stored on your device to enhance your
        experience by remembering your preferences. We use cookies to provide
        personalized content and improve our services. You can adjust your
        browser settings to refuse cookies, though some features of the site may
        not function properly if you do so.
      </p>
      <h2 className="text-3xl text-center font-bold tracking-wider mt-8 mb-1.5">
        Mobile Device and Browser Information
      </h2>
      <p className="text-black tracking-wide text-lg mb-2.5 mt-1 mx-2.5">
        When you access Bdlord from a mobile device, similar data collection
        practices (such as cookies) apply. You can modify your privacy settings
        on your mobile device to manage information sharing.
      </p>
      Usage Logs
      <p className="text-black tracking-wide text-lg mb-2.5 mt-1 mx-2.5">
        We collect non-personal data such as your IP address, browser type, and
        other technical details to understand user behavior and improve the
        site. This data is used for analytics and enhancing the user experience.
      </p>
      <h2 className="text-3xl text-center font-bold tracking-wider mt-8 mb-1.5">
        How We Use Your Information
      </h2>
      <p className="text-black tracking-wide text-lg mb-2.5 mt-1 mx-2.5">
        We use your personal information for the following purposes: Improving
        Services: To personalize your experience and make Bdlord more
        user-friendly. Communicating: To respond to inquiries, send updates, and
        provide customer support. Advertising: To present relevant content and
        property listings based on your preferences. Information Protection We
        implement security measures to protect your personal information from
        unauthorized access or disclosure. Your data is stored securely, and
        only authorized personnel have access to it.
      </p>
      <h2 className="text-3xl text-center font-bold tracking-wider mt-8 mb-1.5">
        Children Under 13
      </h2>
      <p className="text-black tracking-wide text-lg mb-2.5 mt-1 mx-2.5">
        Bdlord does not knowingly collect personal information from individuals
        under the age of 13. If we discover such data has been inadvertently
        collected, we will promptly delete it.
      </p>
      <h2 className="text-3xl text-center font-bold tracking-wider mt-8 mb-1.5">
        Changes to Privacy Policy
      </h2>
      <p className="text-black tracking-wide text-lg mb-2.5 mt-1 mx-2.5">
        We may update this privacy policy periodically. We encourage you to
        review it regularly to stay informed about how we protect your
        information. Your continued use of Bdlord signifies your acceptance of
        any changes made to this policy.
      </p>
      <h2 className="text-3xl text-center font-bold tracking-wider mt-8 mb-1.5">
        Your Consent
      </h2>
      <p className="text-black tracking-wide text-lg mb-2.5 mt-1 mx-2.5">
        By using Bdlord, you agree to the terms of this privacy policy. If you
        do not agree, please discontinue using our site.
      </p>
      <h2 className="text-3xl text-center font-bold tracking-wider mt-8 mb-1.5">
        Contact Us
      </h2>
      <p className="text-black tracking-wide text-lg mb-2.5 mt-1 mx-2.5">
        If you have any questions or concerns about this privacy policy or how
        your data is handled, feel free to contact us at{" "}
        <Link href="/contact-us" className="text-primary">
          Contact Us
        </Link>
        .
      </p>
    </div>
  );
}
