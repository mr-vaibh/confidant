import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"

const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 700 },
]

export default function Announcements() {
    return (
        <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Bell className="h-6 w-6 text-blue-500" />
              <div>
                <h3 className="font-semibold">New Feature Released</h3>
                <p className="text-sm text-gray-500">Check out our latest API improvements</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="h-6 w-6 text-green-500" />
              <div>
                <h3 className="font-semibold">Maintenance Schedule</h3>
                <p className="text-sm text-gray-500">Planned downtime on July 15th</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline">View All</Button>
        </CardFooter>
      </Card>
    )
}
