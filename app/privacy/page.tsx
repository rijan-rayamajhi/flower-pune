import StaticLayout from "@/components/static-layout";

export default function PrivacyPage() {
    return (
        <StaticLayout
            title="Privacy Policy"
            subtitle="Your privacy is important to us."
            maxWidth="2xl"
        >
            <div className="space-y-8">
                <section>
                    <p className="text-charcoal/70 text-sm italic mb-4">Last Updated: February 2026</p>
                    <p className="text-charcoal/80 font-light leading-loose">
                        Luxe Floral Design ("we," "our," or "us") is committed to protecting your privacy.
                        This Privacy Policy explains how we collect, use, and safeguard your personal information.
                    </p>
                </section>

                <section>
                    <h2 className="font-serif text-2xl text-charcoal mb-4">Information We Collect</h2>
                    <p className="text-charcoal/80 font-light leading-loose mb-3">
                        We collect information you provide directly to us, including:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-charcoal/80 font-light pl-4">
                        <li>Name, email address, phone number, and delivery address</li>
                        <li>Payment information (processed securely through third-party providers)</li>
                        <li>Order history and preferences</li>
                        <li>Communications with our customer service team</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-serif text-2xl text-charcoal mb-4">How We Use Your Information</h2>
                    <p className="text-charcoal/80 font-light leading-loose mb-3">
                        We use the information we collect to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-charcoal/80 font-light pl-4">
                        <li>Process and fulfill your orders</li>
                        <li>Send order confirmations and delivery updates</li>
                        <li>Respond to your inquiries and provide customer support</li>
                        <li>Send marketing communications (with your consent)</li>
                        <li>Improve our services and website experience</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-serif text-2xl text-charcoal mb-4">Information Sharing</h2>
                    <p className="text-charcoal/80 font-light leading-loose">
                        We do not sell or rent your personal information to third parties. We may share your information
                        with trusted service providers who assist us in operating our website, processing payments, or
                        delivering orders, provided they agree to keep this information confidential.
                    </p>
                </section>

                <section>
                    <h2 className="font-serif text-2xl text-charcoal mb-4">Data Security</h2>
                    <p className="text-charcoal/80 font-light leading-loose">
                        We implement appropriate technical and organizational measures to protect your personal information
                        against unauthorized access, alteration, disclosure, or destruction.
                    </p>
                </section>

                <section>
                    <h2 className="font-serif text-2xl text-charcoal mb-4">Your Rights</h2>
                    <p className="text-charcoal/80 font-light leading-loose">
                        You have the right to access, update, or delete your personal information at any time.
                        To exercise these rights or if you have questions about this policy, please contact us at
                        <a href="mailto:privacy@luxefloral.com" className="text-burgundy hover:underline ml-1">privacy@luxefloral.com</a>.
                    </p>
                </section>

                <section>
                    <h2 className="font-serif text-2xl text-charcoal mb-4">Cookies</h2>
                    <p className="text-charcoal/80 font-light leading-loose">
                        We use cookies to enhance your browsing experience and analyze website traffic.
                        You can control cookies through your browser settings.
                    </p>
                </section>

                <section>
                    <h2 className="font-serif text-2xl text-charcoal mb-4">Changes to This Policy</h2>
                    <p className="text-charcoal/80 font-light leading-loose">
                        We may update this Privacy Policy from time to time. We will notify you of any changes by
                        posting the new policy on this page with an updated effective date.
                    </p>
                </section>
            </div>
        </StaticLayout>
    );
}
