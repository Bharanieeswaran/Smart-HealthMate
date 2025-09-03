'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, Phone, User as UserIcon, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import Link from 'next/link';

interface EmergencyContact {
    name: string;
    phone: string;
}

export function SOSClient() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isTriggered, setIsTriggered] = useState(false);
    const [contact, setContact] = useState<EmergencyContact | null>(null);

    useEffect(() => {
        if (user) {
            const savedContact = localStorage.getItem(`emergencyContact_${user.uid}`);
            if (savedContact) {
                setContact(JSON.parse(savedContact));
            }
        }
    }, [user]);

    const handleSOS = () => {
        if (!contact || !contact.name || !contact.phone) {
            alert("Please set up your emergency contact in your profile first.");
            return;
        }

        setIsLoading(true);
        // Simulate API call to Twilio/SendGrid
        console.log(`SOS TRIGGERED. Contacting ${contact.name} at ${contact.phone}.`);
        setTimeout(() => {
            setIsLoading(false);
            setIsTriggered(true);
        }, 2000);
    };

    return (
        <div className="grid gap-6">
            <Card className="border-destructive border-2">
                <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2">
                        <ShieldAlert className="h-6 w-6" />
                        Emergency SOS Button
                    </CardTitle>
                    <CardDescription>
                        Press and hold this button for 3 seconds in case of an emergency. This will immediately notify your emergency contact.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <Button
                        size="lg"
                        variant="destructive"
                        className="h-24 w-full text-2xl"
                        onClick={handleSOS}
                        disabled={isLoading || isTriggered}
                    >
                        {isLoading ? (
                            <Loader2 className="h-12 w-12 animate-spin" />
                        ) : (
                            <>
                                <ShieldAlert className="h-12 w-12 mr-4" />
                                TRIGGER SOS
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {isTriggered && (
                 <Alert variant="destructive">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertTitle>SOS Activated!</AlertTitle>
                    <AlertDescription>
                        Your emergency contact has been notified. Help is on the way. If possible, stay calm and in a safe location.
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Your Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent>
                    {contact && contact.name && contact.phone ? (
                        <div className="flex flex-col gap-2">
                            <div className='flex items-center gap-2'>
                                <UserIcon className="h-5 w-5 text-muted-foreground" />
                                <span>{contact.name}</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <span>{contact.phone}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted-foreground">
                            Go to your <Button variant="link" asChild className="p-0"><Link href="/dashboard/profile">profile</Link></Button> to add an emergency contact.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
