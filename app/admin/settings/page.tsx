import { Save } from "lucide-react";
import PageHeader from "@/components/admin/page-header";
import { FloatingInput } from "@/components/ui/floating-input";

export default function SettingsPage() {
    return (
        <div className="max-w-4xl">
            <PageHeader title="Settings" description="Manage your store preferences and configuration." />

            <div className="space-y-8">

                {/* General Settings */}
                <section className="rounded-2xl bg-white p-6 sm:p-8 border border-gray-100/50 shadow-sm">
                    <h2 className="font-serif text-xl font-medium text-charcoal mb-6">General Information</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <FloatingInput label="Store Name" id="storeName" type="text" defaultValue="Luxe Floral" />
                        <FloatingInput label="Support Email" id="supportEmail" type="email" defaultValue="admin@luxefloral.com" />
                        <div className="md:col-span-2">
                            <FloatingInput label="Store Description" id="storeDesc" type="text" defaultValue="Premium floral arrangements for life's special moments." />
                        </div>
                    </div>
                </section>

                {/* Regional Settings */}
                <section className="rounded-2xl bg-white p-6 sm:p-8 border border-gray-100/50 shadow-sm">
                    <h2 className="font-serif text-xl font-medium text-charcoal mb-6">Regional Settings</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm text-charcoal/60 mb-2">Currency</label>
                            <select className="w-full h-14 rounded-lg border border-gray-200 bg-transparent px-4 text-charcoal focus:border-burgundy focus:outline-none">
                                <option>USD ($)</option>
                                <option>EUR (€)</option>
                                <option>GBP (£)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-charcoal/60 mb-2">Timezone</label>
                            <select className="w-full h-14 rounded-lg border border-gray-200 bg-transparent px-4 text-charcoal focus:border-burgundy focus:outline-none">
                                <option>UTC-05:00 Eastern Time</option>
                                <option>UTC-08:00 Pacific Time</option>
                                <option>UTC+00:00 London</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Notifications */}
                <section className="rounded-2xl bg-white p-6 sm:p-8 border border-gray-100/50 shadow-sm">
                    <h2 className="font-serif text-xl font-medium text-charcoal mb-6">Notifications</h2>
                    <div className="space-y-4">
                        {[
                            { id: "notif1", label: "Email me when a new order is placed" },
                            { id: "notif2", label: "Email me when stock is low" },
                            { id: "notif3", label: "Send weekly performance reports" }
                        ].map((opt) => (
                            <div key={opt.id} className="flex items-center gap-3">
                                <input type="checkbox" id={opt.id} defaultChecked className="h-5 w-5 rounded border-gray-300 text-burgundy focus:ring-burgundy" />
                                <label htmlFor={opt.id} className="text-charcoal/80 cursor-pointer select-none">{opt.label}</label>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="flex justify-end pt-4">
                    <button className="btn-primary flex items-center gap-2 px-8 py-3 shadow-lg hover:-translate-y-0.5">
                        <Save className="h-4 w-4" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
