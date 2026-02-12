import StaticLayout from "@/components/static-layout";

export default function FAQPage() {
    const faqs = [
        {
            question: "Do you offer same-day delivery?",
            answer: "Yes, we offer same-day delivery for orders placed before 12:00 PM IST within Pune city limits. Orders placed after this time will be delivered the following day."
        },
        {
            question: "Can I customize my arrangement?",
            answer: "Absolutely. We love creating bespoke designs. You can specify your color palette and flower preferences in the 'Special Instructions' box at checkout, or contact us directly for a custom consultation."
        },
        {
            question: "How long will my flowers last?",
            answer: "With proper care, our arrangements typically last 5-7 days. We include a care guide and flower food with every delivery to help you extend the life of your blooms."
        },
        {
            question: "Do you do wedding and event florals?",
            answer: "Yes, we specialize in intimate weddings and events. Please visit our 'Occasions' page or contact us via our enquiry form to discuss your vision."
        },
        {
            question: "What is your return policy?",
            answer: "Due to the perishable nature of flowers, we do not accept returns. However, if you are not completely satisfied with the quality of your arrangement, please contact us within 24 hours of delivery."
        }
    ];

    return (
        <StaticLayout
            title="Frequently Asked Questions"
            subtitle="Answers to common questions about our services and care."
            maxWidth="2xl"
        >
            <div className="space-y-8">
                {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-stone-200 pb-6 mb-6 last:border-0">
                        <h3 className="font-serif text-lg text-charcoal mb-2 font-medium">{faq.question}</h3>
                        <p className="text-charcoal/70 font-light leading-relaxed">{faq.answer}</p>
                    </div>
                ))}
            </div>
        </StaticLayout>
    );
}
