import { Metadata } from "next";
export const revalidate = 0;
import ContactForm from "@/components/ContactForm";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Lumis Studio. Start a design project or ask us anything.",
};

const contactInfo = [
  {
    label: "Email",
    value: "hello@lumisstudio.com",
    href: "mailto:hello@lumisstudio.com",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Response Time",
    value: "Within 24 hours",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Location",
    value: "San Francisco, CA",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <>
      <main className="pt-24">
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
              {/* Left */}
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-4">
                  Contact
                </p>
                <h1 className="font-display text-5xl md:text-6xl font-bold text-zinc-900 dark:text-white tracking-tight mb-6">
                  Let&apos;s Work
                  <br />
                  Together
                </h1>
                <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-10">
                  Ready to start a project? Tell us about it. We&apos;ll review
                  your inquiry and get back to you with a proposal.
                </p>

                <div className="space-y-4">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                      <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="font-medium text-zinc-900 dark:text-white hover:text-gold-600 dark:hover:text-gold-400 transition-colors">
                            {item.value}
                          </a>
                        ) : (
                          <p className="font-medium text-zinc-900 dark:text-white">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 p-6 rounded-2xl bg-zinc-950 dark:bg-zinc-900 border border-zinc-800">
                  <p className="text-white font-display text-xl font-bold mb-2">
                    Free Discovery Call
                  </p>
                  <p className="text-zinc-400 text-sm">
                    Book a 30-minute free consultation to discuss your project
                    before committing.
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8 md:p-10 shadow-xl shadow-zinc-100/50 dark:shadow-none">
                <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white mb-8">
                  Project Inquiry
                </h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
