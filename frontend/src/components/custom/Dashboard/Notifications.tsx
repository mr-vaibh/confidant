import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { fetcher } from "@/app/fetcher";
import { cn } from "@/lib/utils";

// Type definition for the notification
interface Notification {
  id: number;
  message: string;
  description: string;
  url: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationsProps {
  readonly username: string;
}

export default function Notifications({ username }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch notifications when the component mounts
  useEffect(() => {
    const getNotifications = async () => {
      try {
        const data = await fetcher<{ notifications: Notification[] }>(
          `/account/notifications/${username}/`,
          'GET',
          { username: username }
        );
        setNotifications(data.notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    getNotifications();
  }, [username]);  // Re-fetch if the username changes

  // Mark a notification as read
  const markAsRead = async (id: number) => {
    try {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id ? { ...notification, is_read: true } : notification
        )
      );

      await fetcher("account/notifications/mark-as-read/", 'POST', { notification_id: id });

    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <Card className="shadow-md flex flex-col">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {(() => {
            if (loading) {
              return <div>Loading...</div>;
            }
            if (notifications.length === 0) {
              return <div>No notifications</div>;
            }
            return notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "group relative flex items-start gap-3 p-3 transition-colors hover:bg-muted/50",
                  notification.is_read ? "bg-muted/30" : "bg-background"
                )}
              >
                <div className="mt-1">
                  {notification.is_read ? (
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <div className="relative">
                      <Bell className="h-4 w-4 text-primary" />
                      <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-0.5">
                  <h3 className={cn(
                    "font-medium leading-tight",
                    notification.is_read ? "text-muted-foreground" : "text-foreground"
                  )}>
                    {notification.message}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {notification.description}
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </p>
                </div>
                {!notification.is_read && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => markAsRead(notification.id)}
                  >
                    Mark as Read
                  </Button>
                )}
              </div>
            ));
          })()}
        </div>
      </CardContent>

      {notifications.length > 0 && (
        <CardFooter className="mt-auto">
          <Button variant="outline" className="w-full">
            View All
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
