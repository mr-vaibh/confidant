import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard } from 'lucide-react'

export default function MonthlyPerformance() {
    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle>Billing Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span>Current Plan</span>
                        <Badge>Pro</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Next Billing Date</span>
                        <span>July 1, 2023</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Amount Due</span>
                        <span className="font-semibold">$49.99</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full"><CreditCard className="mr-2 h-4 w-4" /> Manage Billing</Button>
            </CardFooter>
        </Card>
    )
}
