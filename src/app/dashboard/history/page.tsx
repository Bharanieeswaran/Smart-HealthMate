
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/use-auth';
import { Download, FileText, MessageSquare, Stethoscope, Trash2, FileScan, User, Calendar } from "lucide-react";
import { generatePdf } from "@/lib/pdf-utils";
import { type CheckSymptomsOutput, type PrescriptionOutput } from '@/ai/schemas';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Pill } from 'lucide-react';

interface SymptomHistoryItem {
    symptoms: string;
    result: CheckSymptomsOutput;
    date: string;
}

interface ChatHistoryItem {
    question: string;
    answer: string;
    date: string;
}

interface PrescriptionHistoryItem {
    result: PrescriptionOutput;
    date: string;
}

export default function HistoryPage() {
    const { user } = useAuth();
    const [symptomHistory, setSymptomHistory] = useState<SymptomHistoryItem[]>([]);
    const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
    const [prescriptionHistory, setPrescriptionHistory] = useState<PrescriptionHistoryItem[]>([]);

    useEffect(() => {
        if (user) {
            const savedSymptomHistory = localStorage.getItem(`symptomHistory_${user.uid}`);
            if (savedSymptomHistory) {
                setSymptomHistory(JSON.parse(savedSymptomHistory));
            }

            const savedChatHistory = localStorage.getItem(`chatHistory_${user.uid}`);
            if (savedChatHistory) {
                setChatHistory(JSON.parse(savedChatHistory));
            }

            const savedPrescriptionHistory = localStorage.getItem(`prescriptionHistory_${user.uid}`);
            if (savedPrescriptionHistory) {
                setPrescriptionHistory(JSON.parse(savedPrescriptionHistory));
            }
        }
    }, [user]);

    const handleDownload = () => {
        if (user) {
            generatePdf(user);
        }
    };

    const clearHistory = (historyType: 'symptom' | 'chat' | 'prescription') => {
        if (user && window.confirm(`Are you sure you want to clear all ${historyType} history? This cannot be undone.`)) {
            if (historyType === 'symptom') {
                localStorage.removeItem(`symptomHistory_${user.uid}`);
                setSymptomHistory([]);
            } else if (historyType === 'chat') {
                localStorage.removeItem(`chatHistory_${user.uid}`);
                setChatHistory([]);
            } else {
                localStorage.removeItem(`prescriptionHistory_${user.uid}`);
                setPrescriptionHistory([]);
            }
        }
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">Medical History & Reports</h1>
            </div>
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Your Health Report</CardTitle>
                        <CardDescription>A summary of your recent health information. You can download this report as a PDF.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <div className="flex items-start gap-4 p-4 border rounded-lg">
                        <FileText className="h-8 w-8 text-primary mt-1"/>
                        <div>
                            <h3 className="font-semibold">Weekly Health Summary</h3>
                            <p className="text-sm text-muted-foreground">Generated on: {new Date().toLocaleDateString()}</p>
                            <p className="text-sm text-muted-foreground">Includes: Key Metrics, Recent AI Recommendations</p>
                        </div>
                    </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Symptom Checker History</CardTitle>
                            <CardDescription>Review your past symptom analyses.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => clearHistory('symptom')} disabled={symptomHistory.length === 0}>
                            <Trash2 className="mr-2 h-4 w-4" /> Clear
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {symptomHistory.length > 0 ? (
                            <Accordion type="single" collapsible className="w-full">
                                {symptomHistory.map((item, index) => (
                                    <AccordionItem value={`item-${index}`} key={index}>
                                        <AccordionTrigger>
                                            <div className="flex items-center gap-2">
                                                <Stethoscope className="h-5 w-5 text-primary" />
                                                <span>Analysis from {new Date(item.date).toLocaleDateString()}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <p className="font-semibold text-base mb-2">Your Symptoms:</p>
                                            <p className="text-muted-foreground italic mb-4">&quot;{item.symptoms}&quot;</p>
                                            <div className="space-y-2">
                                            {item.result.conditions.map((c, i) => (
                                                <div key={i} className="p-2 border rounded-md">
                                                    <div className="flex justify-between items-center">
                                                        <p className="font-semibold">{c.condition}</p>
                                                        <Badge variant={c.confidence > 0.7 ? 'default' : 'secondary'}>{Math.round(c.confidence * 100)}% Conf.</Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-1">{c.nextSteps}</p>
                                                </div>
                                            ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        ) : (
                            <p className="text-muted-foreground">No symptom checker history found.</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Prescription History</CardTitle>
                            <CardDescription>Review your past prescription scans.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => clearHistory('prescription')} disabled={prescriptionHistory.length === 0}>
                            <Trash2 className="mr-2 h-4 w-4" /> Clear
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {prescriptionHistory.length > 0 ? (
                            <Accordion type="single" collapsible className="w-full">
                                {prescriptionHistory.map((item, index) => (
                                    <AccordionItem value={`item-${index}`} key={index}>
                                        <AccordionTrigger>
                                            <div className="flex items-center gap-2">
                                                <FileScan className="h-5 w-5 text-primary" />
                                                <span>Scan from {new Date(item.date).toLocaleDateString()}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /> <span className="font-semibold">Patient:</span> {item.result.patientName || 'N/A'}</div>
                                                <div className="flex items-center gap-2"><Stethoscope className="h-4 w-4 text-muted-foreground" /> <span className="font-semibold">Doctor:</span> {item.result.doctorName || 'N/A'}</div>
                                                <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> <span className="font-semibold">Date:</span> {item.result.prescriptionDate || 'N/A'}</div>
                                                <h4 className="font-semibold text-base border-t pt-3 mt-3">Medications</h4>
                                                <div className="space-y-2">
                                                    {item.result.medications.map((med, i) => (
                                                        <div key={i} className="p-2 border rounded-md bg-muted/50">
                                                            <div className="flex items-center gap-2 font-bold text-sm">
                                                                <Pill className="h-4 w-4 text-primary" />
                                                                {med.name}
                                                            </div>
                                                            <p className="text-xs text-muted-foreground ml-6"><strong>Dosage:</strong> {med.dosage} ({med.form})</p>
                                                            <p className="text-xs text-muted-foreground ml-6"><strong>Frequency:</strong> {med.frequency}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        ) : (
                            <p className="text-muted-foreground">No prescription history found.</p>
                        )}
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                         <div>
                            <CardTitle>AI Chat History</CardTitle>
                            <CardDescription>Review your past conversations with the AI.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => clearHistory('chat')} disabled={chatHistory.length === 0}>
                            <Trash2 className="mr-2 h-4 w-4" /> Clear
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {chatHistory.length > 0 ? (
                             <Accordion type="single" collapsible className="w-full">
                                {chatHistory.map((item, index) => (
                                    <AccordionItem value={`item-${index}`} key={index}>
                                        <AccordionTrigger>
                                            <div className="flex items-center gap-2">
                                                <MessageSquare className="h-5 w-5 text-primary" />
                                                <span>Chat from {new Date(item.date).toLocaleDateString()}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <p className="font-semibold text-base mb-2">Your Question:</p>
                                            <p className="text-muted-foreground italic mb-4">&quot;{item.question}&quot;</p>
                                            <p className="font-semibold text-base mb-2">AI's Answer:</p>
                                            <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">{item.answer}</div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        ) : (
                            <p className="text-muted-foreground">No chat history found.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
