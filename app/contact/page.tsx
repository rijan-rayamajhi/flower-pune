"use client";

import StaticLayout from "@/components/static-layout";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
    return (
        <StaticLayout
            title="Get in Touch"
            subtitle="We'd love to hear from you. Reach out for inquiries, custom orders, or just to say hello."
            maxWidth="4xl"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">

                {/* Contact Info */}
                <div className="space-y-10">
                    <div>
                        <h3 className="font-serif text-2xl text-charcoal mb-6">Studio</h3>
                        <div className="flex items-start gap-4 text-charcoal/80 font-light leading-relaxed">
                            <MapPin className="h-5 w-5 mt-1 shrink-0 text-burgundy" />
                            <p>
                                123 Floral Avenue, Koregaon Park<br />
                                Pune, Maharashtra 411001<br />
                                India
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-serif text-xl text-charcoal mb-4">Contact</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-charcoal/80 font-light">
                                <Phone className="h-5 w-5 text-burgundy" />
                                <a href="tel:+919876543210" className="hover:text-burgundy transition-colors">+91 987 654 3210</a>
                            </div>
                            <div className="flex items-center gap-4 text-charcoal/80 font-light">
                                <Mail className="h-5 w-5 text-burgundy" />
                                <a href="mailto:hello@luxefloral.com" className="hover:text-burgundy transition-colors">hello@luxefloral.com</a>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-serif text-xl text-charcoal mb-4">Hours</h3>
                        <p className="text-charcoal/80 font-light leading-relaxed">
                            Monday - Saturday: 9:00 AM - 7:00 PM<br />
                            Sunday: 10:00 AM - 4:00 PM
                        </p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white p-8 shadow-sm border border-stone-100">
                    <h3 className="font-serif text-2xl text-charcoal mb-6">Send a Message</h3>
                    <form className="space-y-6">
                        <div className="space-y-1">
                            <label htmlFor="name" className="text-xs font-medium text-charcoal/60 uppercase tracking-wide">Name</label>
                            <input
                                type="text"
                                id="name"
                                className="w-full border-b border-stone-300 py-2 text-charcoal focus:border-burgundy focus:outline-none transition-colors bg-transparent placeholder:text-stone-400"
                                placeholder="Your Name"
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="email" className="text-xs font-medium text-charcoal/60 uppercase tracking-wide">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full border-b border-stone-300 py-2 text-charcoal focus:border-burgundy focus:outline-none transition-colors bg-transparent placeholder:text-stone-400"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="subject" className="text-xs font-medium text-charcoal/60 uppercase tracking-wide">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                className="w-full border-b border-stone-300 py-2 text-charcoal focus:border-burgundy focus:outline-none transition-colors bg-transparent placeholder:text-stone-400"
                                placeholder="Inquiry"
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="message" className="text-xs font-medium text-charcoal/60 uppercase tracking-wide">Message</label>
                            <textarea
                                id="message"
                                rows={4}
                                className="w-full border-b border-stone-300 py-2 text-charcoal focus:border-burgundy focus:outline-none transition-colors bg-transparent resize-none placeholder:text-stone-400"
                                placeholder="How can we help you?"
                            />
                        </div>

                        <button type="submit" className="w-full bg-charcoal text-white py-3 font-medium text-sm tracking-wide hover:bg-burgundy transition-colors uppercase mt-4">
                            Send Message
                        </button>
                    </form>
                </div>

            </div>
        </StaticLayout>
    );
}
