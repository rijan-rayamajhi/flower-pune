"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, Check, ExternalLink, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/app/admin/actions";
import { formatDistanceToNow } from "date-fns";

type Notification = {
    id: string;
    type: "order" | "message" | "alert";
    title: string;
    message: string;
    link?: string;
    is_read: boolean;
    created_at: string;
};

export default function NotificationsDropdown() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const fetchNotifications = useCallback(async () => {
        setIsLoading(true);
        const res = await getNotifications(10);
        if (res.notifications) {
            setNotifications(res.notifications as Notification[]);
            setUnreadCount(res.unreadCount || 0);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        let isMounted = true;
        const run = async () => {
            if (isMounted) await fetchNotifications();
        };

        // Initial fetch
        run();

        // Poll every 60 seconds
        const interval = setInterval(run, 60000);
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [fetchNotifications]);

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest(".notifications-dropdown")) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleMarkAsRead = async (id: string, link?: string) => {
        // Optimistic update
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));

        await markNotificationAsRead(id);

        if (link) {
            setIsOpen(false);
            router.push(link);
        }
    };

    const handleMarkAllRead = async () => {
        setNotifications((prev) =>
            prev.map((n) => ({ ...n, is_read: true }))
        );
        setUnreadCount(0);
        await markAllNotificationsAsRead();
    };

    return (
        <div className="relative notifications-dropdown">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative text-charcoal/60 hover:text-burgundy transition-colors p-2"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-burgundy ring-2 ring-white animate-pulse" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-lg border border-gray-100 bg-white shadow-xl shadow-gray-200/50 overflow-hidden z-50 transform transition-all duration-200 ease-in-out origin-top-right">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-charcoal text-sm">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="bg-burgundy/10 text-burgundy text-xs px-1.5 py-0.5 rounded-full font-medium">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={fetchNotifications}
                                disabled={isLoading}
                                className="text-charcoal/40 hover:text-burgundy transition-colors p-1"
                                title="Refresh"
                            >
                                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                            </button>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-xs text-charcoal/50 hover:text-burgundy transition-colors font-medium flex items-center gap-1"
                                >
                                    <Check className="h-3 w-3" />
                                    Mark all read
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="max-h-[360px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Bell className="h-8 w-8 text-charcoal/10 mb-2" />
                                <p className="text-sm text-charcoal/50">No notifications yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`group flex items-start gap-3 p-4 transition-colors hover:bg-gray-50 ${!notification.is_read ? "bg-burgundy/[0.02]" : ""
                                            }`}
                                    >
                                        <div className="mt-1">
                                            <div
                                                className={`h-2 w-2 rounded-full ${!notification.is_read ? "bg-burgundy" : "bg-gray-200"
                                                    }`}
                                            />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <p className={`text-sm ${!notification.is_read ? "font-semibold text-charcoal" : "text-charcoal/80"}`}>
                                                    {notification.title}
                                                </p>
                                                <span className="text-[10px] text-charcoal/40 whitespace-nowrap ml-2">
                                                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-charcoal/60 leading-relaxed line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center gap-3 pt-1">
                                                {notification.link && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(notification.id, notification.link)}
                                                        className="text-xs text-burgundy font-medium hover:underline flex items-center gap-1"
                                                    >
                                                        View Details
                                                        <ExternalLink className="h-3 w-3" />
                                                    </button>
                                                )}
                                                {!notification.is_read && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                        className="text-xs text-charcoal/40 hover:text-charcoal transition-colors"
                                                    >
                                                        Mark as read
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
