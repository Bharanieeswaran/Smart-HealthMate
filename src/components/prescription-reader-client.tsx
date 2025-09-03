
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, FileUp, Loader2, ScanLine, AlertTriangle, Pill, User, Stethoscope as DoctorIcon, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { useToast } from '@/hooks/use-toast';
import { readPrescription } from '@/ai/flows/prescription-reader';
import { type PrescriptionOutput } from '@/ai/schemas';
import { useAuth } from '@/hooks/use-auth';

export function PrescriptionReaderClient() {
  const { toast } = useToast();
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PrescriptionOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
        setIsCameraOn(true);
      } catch (err) {
        console.error("Error accessing camera:", err);
        setHasCameraPermission(false);
        setError("Could not access camera. Please check browser permissions.");
      }
    } else {
      setHasCameraPermission(false);
      setError("Camera not supported on this device.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
    }
  };
  
  useEffect(() => {
    return () => stopCamera();
  }, []);

  const saveToHistory = (result: PrescriptionOutput) => {
    if (user) {
        const newItem = { result, date: new Date().toISOString() };
        const history = JSON.parse(localStorage.getItem(`prescriptionHistory_${user.uid}`) || '[]');
        history.unshift(newItem);
        localStorage.setItem(`prescriptionHistory_${user.uid}`, JSON.stringify(history));
    }
  };

  const captureImage = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const imageDataUri = canvas.toDataURL('image/jpeg');
        stopCamera();
        await analyzeImage(imageDataUri);
    }
    setIsLoading(false);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageDataUri = e.target?.result as string;
        setIsLoading(true);
        setError(null);
        setResult(null);
        await analyzeImage(imageDataUri);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (imageDataUri: string) => {
    try {
      const response = await readPrescription({ imageDataUri });
      setResult(response);
      saveToHistory(response);
       toast({
        title: 'Analysis Complete',
        description: 'Prescription details have been extracted and saved to your history.',
      });
    } catch (e) {
      console.error(e);
      setError('Failed to analyze prescription. The image might be unclear or the format is not supported. Please try again.');
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not read the prescription from the image.',
      });
    }
  };

  const ResultDisplay = ({ result }: { result: PrescriptionOutput }) => (
    <Card>
      <CardHeader>
        <CardTitle>Extracted Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-primary" />
          <p><strong>Patient:</strong> {result.patientName || 'Not found'}</p>
        </div>
        <div className="flex items-center gap-3">
          <DoctorIcon className="h-5 w-5 text-primary" />
          <p><strong>Doctor:</strong> {result.doctorName || 'Not found'}</p>
        </div>
         <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-primary" />
          <p><strong>Date:</strong> {result.prescriptionDate || 'Not found'}</p>
        </div>

        <h4 className="font-semibold text-lg border-t pt-4 mt-4">Medications</h4>
        <div className="space-y-3">
          {result.medications.map((med, index) => (
            <div key={index} className="p-3 border rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 font-bold text-base">
                 <Pill className="h-5 w-5 text-primary" />
                 {med.name}
              </div>
              <p className="text-sm ml-7"><strong>Dosage:</strong> {med.dosage} ({med.form})</p>
              <p className="text-sm ml-7"><strong>Frequency:</strong> {med.frequency}</p>
              <p className="text-sm ml-7"><strong>Quantity:</strong> {med.quantity}</p>
            </div>
          ))}
        </div>
        
         <p className="border-t pt-4"><strong>Refills:</strong> {result.refills || 'Not found'}</p>

        <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Disclaimer</AlertTitle>
            <AlertDescription>
            This AI-generated information is for convenience only. Always verify with the original prescription and consult a pharmacist or your doctor if you have any questions.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Scan Your Prescription</CardTitle>
          <CardDescription>Use your camera to scan a prescription or upload an image file. Make sure the text is clear and well-lit.</CardDescription>
        </CardHeader>
        <CardContent>
          {isCameraOn ? (
             <div className="relative">
                <video ref={videoRef} className="w-full h-auto rounded-md border" autoPlay playsInline />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <ScanLine className="w-2/3 h-2/3 text-white/30" />
                </div>
             </div>
          ) : (
             <div className="flex items-center justify-center w-full h-64 border-2 border-dashed rounded-md bg-muted/50">
                <div className="text-center text-muted-foreground">
                    <Camera className="mx-auto h-12 w-12" />
                    <p>Camera is off or not available</p>
                </div>
             </div>
          )}
          <div className="flex flex-wrap gap-2 mt-4">
            {!isCameraOn ? (
                 <Button onClick={startCamera} disabled={hasCameraPermission === false}>
                    <Camera className="mr-2 h-4 w-4" /> Start Camera
                </Button>
            ) : (
                <Button onClick={captureImage} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />} Capture
                </Button>
            )}
            
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" disabled={isLoading}>
                <FileUp className="mr-2 h-4 w-4" /> Upload File
            </Button>
             <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>
           {hasCameraPermission === false && (
                <Alert variant="destructive" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Camera Access Denied</AlertTitle>
                    <AlertDescription>Please enable camera permissions in your browser settings to use this feature.</AlertDescription>
                </Alert>
           )}
        </CardContent>
      </Card>
        <canvas ref={canvasRef} className="hidden" />

      {isLoading && (
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Analyzing prescription... this may take a moment.</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && <ResultDisplay result={result} />}
    </div>
  );
}
