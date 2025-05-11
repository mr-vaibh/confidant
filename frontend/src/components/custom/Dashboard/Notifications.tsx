import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { fetcher } from "@/app/fetcher";  // Import fetcher function

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
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
                className={`flex items-center space-x-4 ${notification.is_read ? "bg-gray-100" : ""}`}
              >
                <Bell className="h-6 w-6 text-blue-500" />
                <div>
                  <h3 className="font-semibold">{notification.message}</h3>
                  <p className="text-sm text-gray-500">{notification.description}</p>
                </div>
                {!notification.is_read && (
                  <Button
                    size="sm"
                    variant="outline"
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
        <CardFooter>
          <Button variant="outline">View All</Button>
        </CardFooter>
      )}
    </Card>
  );
}
