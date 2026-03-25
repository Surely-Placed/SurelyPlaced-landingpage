import { useLayoutEffect } from "react";
import { SurelyPlacedLogo } from "@/components/Logo";

export function PrivacyPage() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    root.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
    root.style.scrollBehavior = prev;
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-surface text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-narrow flex items-center justify-between py-4">
          <a href="#home" className="flex items-center gap-3">
            <SurelyPlacedLogo className="h-10 w-auto sm:h-10" />
          </a>
        </div>
      </header>
      <main className="flex-1">
        <div className="container-narrow py-12 sm:py-16">
          <p className="mb-6">
            <a
              href="#home"
              className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              Back to Home
            </a>
          </p>
          <p className="text-xs font-semibold uppercase tracking-wide text-teal">Legal</p>
          <h1 className="mt-2 font-display text-3xl text-slate-900 sm:text-4xl">Privacy Policy</h1>
          <p className="mt-2 text-sm text-slate-500">Last Updated: January 1, 2024</p>

          <div className="mt-10 max-w-3xl space-y-8 text-sm leading-relaxed text-slate-600 sm:text-base">
            <section className="space-y-3">
              <h2 className="font-display text-lg font-semibold text-slate-900">1. Introduction</h2>
              <p>
                SurelyPlaced (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your
                privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your
                information when you use our website and career services (&quot;Service&quot;). Please read
                this Privacy Policy carefully. By using our Service, you agree to the collection and use of
                information in accordance with this policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-lg font-semibold text-slate-900">2. Information We Collect</h2>
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-800">2.1 Information You Provide</h3>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <span className="font-medium text-slate-700">Contact Information: </span>
                    When you submit a form or contact us, we may collect your name, email address, phone
                    number, and the message content you provide.
                  </li>
                  <li>
                    <span className="font-medium text-slate-700">Career Documents: </span>
                    If you share a resume, profile, or related documents, we may collect the content you
                    provide, which may include work history, education, skills, and other information
                    contained in those documents.
                  </li>
                  <li>
                    <span className="font-medium text-slate-700">Profile Information: </span>
                    Any additional information you choose to share with us in connection with career
                    mentorship or recruitment support.
                  </li>
                  <li>
                    <span className="font-medium text-slate-700">Communication Data: </span>
                    Information you provide when communicating with our team.
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-800">2.2 Automatically Collected Information</h3>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <span className="font-medium text-slate-700">Usage Data: </span>
                    Information about how you access and use our Service, including IP address, browser type,
                    device information, pages visited, and time spent on pages.
                  </li>
                  <li>
                    <span className="font-medium text-slate-700">Cookies and Tracking Technologies: </span>
                    We may use cookies and similar technologies to track activity on our Service and store
                    certain information.
                  </li>
                  <li>
                    <span className="font-medium text-slate-700">Log Data: </span>
                    Server logs that may include your IP address, browser type, browser version, pages
                    visited, time and date of visit, and other statistics.
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg font-semibold text-slate-900">3. How We Use Your Information</h2>
              <p>We use the information we collect for the following purposes:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>To provide, maintain, and improve our Service</li>
                <li>To deliver career mentorship, recruitment support, and related recommendations</li>
                <li>To communicate with you about inquiries, services, or customer support</li>
                <li>
                  To send updates and service-related communications (and marketing, where permitted/with
                  consent)
                </li>
                <li>To detect, prevent, and address technical issues and security threats</li>
                <li>To comply with legal obligations and enforce our Terms of Service</li>
                <li>To analyze usage patterns and improve user experience</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg font-semibold text-slate-900">4. Data Storage and Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your
                personal information against unauthorized access, alteration, disclosure, or destruction.
                However, no method of transmission over the Internet or electronic storage is 100% secure.
                While we strive to use commercially acceptable means to protect your information, we cannot
                guarantee absolute security.
              </p>
              <p>
                We retain your information for as long as necessary to provide our Service and comply with
                legal obligations.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg font-semibold text-slate-900">
                5. Information Sharing and Disclosure
              </h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your
                information only in the following circumstances:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <span className="font-medium text-slate-700">Service Providers: </span>
                  We may share information with third-party service providers who perform services on our
                  behalf, such as cloud hosting, analytics, and customer support. These providers are
                  contractually obligated to protect your information.
                </li>
                <li>
                  <span className="font-medium text-slate-700">Legal Requirements: </span>
                  We may disclose information if required by law, court order, or government regulation, or to
                  protect our rights, property, or safety, or that of our users.
                </li>
                <li>
                  <span className="font-medium text-slate-700">Business Transfers: </span>
                  In the event of a merger, acquisition, or sale of assets, your information may be
                  transferred as part of that transaction.
                </li>
                <li>
                  <span className="font-medium text-slate-700">With Your Consent: </span>
                  We may share your information with your explicit consent for any other purpose.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg font-semibold text-slate-900">6. Your Rights and Choices</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <span className="font-medium text-slate-700">Access: </span>
                  You can request access to the personal information we hold about you.
                </li>
                <li>
                  <span className="font-medium text-slate-700">Correction: </span>
                  You can request updates or corrections to your personal information.
                </li>
                <li>
                  <span className="font-medium text-slate-700">Deletion: </span>
                  You can request deletion of your data by contacting us.
                </li>
                <li>
                  <span className="font-medium text-slate-700">Data Portability: </span>
                  You can request a copy of your data in a structured, machine-readable format.
                </li>
                <li>
                  <span className="font-medium text-slate-700">Opt-Out: </span>
                  You can opt-out of marketing communications using the unsubscribe link in our emails.
                </li>
                <li>
                  <span className="font-medium text-slate-700">Cookie Preferences: </span>
                  You can manage cookie preferences through your browser settings.
                </li>
              </ul>
              <p>
                To exercise these rights, please contact us at{" "}
                <a className="font-medium text-primary hover:underline" href="mailto:hr@ssggetjob.com">
                  hr@ssggetjob.com
                </a>
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg font-semibold text-slate-900">7. Children&apos;s Privacy</h2>
              <p>
                Our Service is not intended for individuals under the age of 18. We do not knowingly collect
                personal information from children under 18. If you become aware that a child has provided us
                with personal information, please contact us, and we will take steps to delete such
                information.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg font-semibold text-slate-900">8. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your country of
                residence. These countries may have data protection laws that differ from those in your
                country. By using our Service, you consent to the transfer of your information to these
                countries.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg font-semibold text-slate-900">9. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by
                posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date. You are
                advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg font-semibold text-slate-900">10. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us:</p>
              <p>
                Email:{" "}
                <a className="font-medium text-primary hover:underline" href="mailto:hr@ssggetjob.com">
                  hr@ssggetjob.com
                </a>
              </p>
              <p>
                Address: SurelyPlaced
                <br />
                Gandhinagar, Gujarat, India
              </p>
            </section>
          </div>

          <p className="mt-12">
            <a
              href="#home"
              className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              Back to Home
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
