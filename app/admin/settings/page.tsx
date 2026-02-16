"use client";

import { useState, useEffect } from "react";
import { Save, Smartphone, Loader2, CheckCircle, MapPin, Plus, X } from "lucide-react";
import PageHeader from "@/components/admin/page-header";
import { FloatingInput } from "@/components/ui/floating-input";
import { getSiteSettings, updateSiteSetting } from "./actions";

export default function SettingsPage() {
    const [upiId, setUpiId] = useState("");
    const [storeName, setStoreName] = useState("Flower Pune");
    const [supportEmail, setSupportEmail] = useState("");
    const [storeDesc, setStoreDesc] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [saveMessage, setSaveMessage] = useState("");

    // Pincodes
    const [pincodes, setPincodes] = useState<string[]>([]);
    const [newPincode, setNewPincode] = useState("");
    const [pincodeError, setPincodeError] = useState("");

    // Load settings from DB
    useEffect(() => {
        async function loadSettings() {
            try {
                const settings = await getSiteSettings();
                setUpiId(settings["upi_id"] || "");
                setStoreName(settings["store_name"] || "Flower Pune");
                setSupportEmail(settings["support_email"] || "");
                setStoreDesc(settings["store_description"] || "");

                // Parse pincodes
                const raw = settings["serviceable_pincodes"] || "";
                if (raw.trim()) {
                    setPincodes(raw.split(",").map(p => p.trim()).filter(Boolean));
                }
            } catch (err) {
                console.error("Failed to load settings:", err);
            } finally {
                setIsLoading(false);
            }
        }
        loadSettings();
    }, []);

    const addPincode = () => {
        const pin = newPincode.trim();
        setPincodeError("");

        if (!pin) return;
        if (!/^\d{6}$/.test(pin)) {
            setPincodeError("Pincode must be exactly 6 digits.");
            return;
        }
        if (pincodes.includes(pin)) {
            setPincodeError("This pincode is already added.");
            return;
        }

        setPincodes(prev => [...prev, pin]);
        setNewPincode("");
    };

    const removePincode = (pin: string) => {
        setPincodes(prev => prev.filter(p => p !== pin));
    };

    const handlePincodeKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addPincode();
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveStatus('idle');

        try {
            const results = await Promise.all([
                updateSiteSetting("upi_id", upiId),
                updateSiteSetting("store_name", storeName),
                updateSiteSetting("support_email", supportEmail),
                updateSiteSetting("store_description", storeDesc),
                updateSiteSetting("serviceable_pincodes", pincodes.join(",")),
            ]);

            const failed = results.find(r => !r.success);
            if (failed) {
                setSaveStatus('error');
                setSaveMessage(failed.error || "Failed to save.");
            } else {
                setSaveStatus('success');
                setSaveMessage("Settings saved successfully!");
            }
        } catch {
            setSaveStatus('error');
            setSaveMessage("An unexpected error occurred.");
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl">
                <PageHeader title="Settings" description="Manage your store preferences and configuration." />
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="h-6 w-6 animate-spin text-burgundy" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl">
            <PageHeader title="Settings" description="Manage your store preferences and configuration." />

            <div className="space-y-8">

                {/* General Settings */}
                <section className="rounded-2xl bg-white p-6 sm:p-8 border border-gray-100/50 shadow-sm">
                    <h2 className="font-serif text-xl font-medium text-charcoal mb-6">General Information</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <FloatingInput
                            label="Store Name"
                            id="storeName"
                            type="text"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                        />
                        <FloatingInput
                            label="Support Email"
                            id="supportEmail"
                            type="email"
                            value={supportEmail}
                            onChange={(e) => setSupportEmail(e.target.value)}
                        />
                        <div className="md:col-span-2">
                            <FloatingInput
                                label="Store Description"
                                id="storeDesc"
                                type="text"
                                value={storeDesc}
                                onChange={(e) => setStoreDesc(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                {/* Payment Settings */}
                <section className="rounded-2xl bg-white p-6 sm:p-8 border border-gray-100/50 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-burgundy/10">
                            <Smartphone className="h-5 w-5 text-burgundy" />
                        </div>
                        <div>
                            <h2 className="font-serif text-xl font-medium text-charcoal">Payment Settings</h2>
                            <p className="text-sm text-charcoal/50">Configure your UPI payment details</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <FloatingInput
                            label="UPI ID (e.g. yourname@upi)"
                            id="upiId"
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                        />
                        <p className="text-xs text-charcoal/50">
                            This UPI ID will be used to generate QR codes on the checkout page. Customers will scan this QR to make payments.
                        </p>
                    </div>
                </section>

                {/* Delivery Pincodes */}
                <section className="rounded-2xl bg-white p-6 sm:p-8 border border-gray-100/50 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                            <MapPin className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="font-serif text-xl font-medium text-charcoal">Serviceable Pincodes</h2>
                            <p className="text-sm text-charcoal/50">Manage delivery areas by adding serviceable pin codes</p>
                        </div>
                    </div>

                    {/* Add Pincode */}
                    <div className="flex gap-3 mb-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={newPincode}
                                onChange={(e) => {
                                    setNewPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
                                    setPincodeError("");
                                }}
                                onKeyDown={handlePincodeKeyDown}
                                placeholder="Enter 6-digit pincode"
                                maxLength={6}
                                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/30 focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={addPincode}
                            className="flex items-center gap-2 rounded-lg bg-burgundy px-5 py-3 text-sm font-medium text-white hover:bg-burgundy/90 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Add
                        </button>
                    </div>

                    {pincodeError && (
                        <p className="text-xs text-red-500 mb-3">{pincodeError}</p>
                    )}

                    {/* Pincode List */}
                    {pincodes.length === 0 ? (
                        <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
                            <MapPin className="h-8 w-8 text-charcoal/20 mx-auto mb-2" />
                            <p className="text-sm text-charcoal/40">No pincodes added yet.</p>
                            <p className="text-xs text-charcoal/30 mt-1">Add pincodes where you offer delivery service.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-xs text-charcoal/50 mb-2">
                                {pincodes.length} pincode{pincodes.length !== 1 ? 's' : ''} configured
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {pincodes.map((pin) => (
                                    <div
                                        key={pin}
                                        className="group flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/50 px-3 py-1.5 text-sm font-mono font-medium text-emerald-700 transition-all hover:bg-red-50 hover:border-red-200/50 hover:text-red-700"
                                    >
                                        {pin}
                                        <button
                                            type="button"
                                            onClick={() => removePincode(pin)}
                                            className="rounded-full p-0.5 text-emerald-400 group-hover:text-red-500 transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                {/* Regional Settings */}
                <section className="rounded-2xl bg-white p-6 sm:p-8 border border-gray-100/50 shadow-sm">
                    <h2 className="font-serif text-xl font-medium text-charcoal mb-6">Regional Settings</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm text-charcoal/60 mb-2">Currency</label>
                            <select className="w-full h-14 rounded-lg border border-gray-200 bg-transparent px-4 text-charcoal focus:border-burgundy focus:outline-none">
                                <option>INR (₹)</option>
                                <option>USD ($)</option>
                                <option>EUR (€)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-charcoal/60 mb-2">Timezone</label>
                            <select className="w-full h-14 rounded-lg border border-gray-200 bg-transparent px-4 text-charcoal focus:border-burgundy focus:outline-none">
                                <option>UTC+05:30 India (IST)</option>
                                <option>UTC+00:00 London</option>
                                <option>UTC-05:00 Eastern Time</option>
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

                {/* Save Button + Status */}
                <div className="flex items-center justify-end gap-4 pt-4">
                    {saveStatus === 'success' && (
                        <div className="flex items-center gap-2 text-green-600 text-sm font-medium animate-in fade-in">
                            <CheckCircle className="h-4 w-4" />
                            {saveMessage}
                        </div>
                    )}
                    {saveStatus === 'error' && (
                        <p className="text-red-500 text-sm font-medium">{saveMessage}</p>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="btn-primary flex items-center gap-2 px-8 py-3 shadow-lg hover:-translate-y-0.5 disabled:opacity-60"
                    >
                        {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
