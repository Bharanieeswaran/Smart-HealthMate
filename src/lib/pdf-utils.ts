import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { User } from '@/hooks/use-auth';
import type { HealthData } from '@/components/health-metrics-chart';
import { format } from 'date-fns';

// Extend jsPDF with autoTable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export function generatePdf(user: User) {
  const doc = new jsPDF() as jsPDFWithAutoTable;
  
  // Header
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Smart Health Mate - Health Report', 20, 20);
  
  // User Info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Patient Name: ${user.displayName || 'N/A'}`, 20, 35);
  doc.text(`Patient Email: ${user.email || 'N/A'}`, 20, 42);
  doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 49);

  // Divider
  doc.setLineWidth(0.5);
  doc.line(20, 55, 190, 55);

  let currentY = 65;

  // Section: Health Metrics
  const healthMetrics: HealthData[] = JSON.parse(localStorage.getItem(`healthMetrics_${user.uid}`) || '[]');

  if (healthMetrics.length > 0) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Daily Health Metrics', 20, currentY);
    currentY += 10;

    const tableData = healthMetrics.map(d => [
        format(new Date(d.date), 'MM/dd/yyyy'),
        `${d.bp_systolic}/${d.bp_diastolic}`,
        d.sugar,
        d.heartRate,
        d.steps.toLocaleString()
    ]);
    
    doc.autoTable({
        startY: currentY,
        head: [['Date', 'Blood Pressure', 'Blood Sugar (mg/dL)', 'Heart Rate (bpm)', 'Steps']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [30, 144, 255] }
    });

    currentY = (doc as any).lastAutoTable.finalY + 15;
  } else {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.text('No daily health metrics logged for this period.', 20, currentY);
    currentY += 15;
  }
  

  // Disclaimer
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text(
    'This report is generated for informational purposes only and does not constitute medical advice. Please consult with a healthcare professional for any health concerns.', 
    20, currentY, { maxWidth: 170 }
  );

  // Save the PDF
  doc.save(`Health_Report_${user.displayName?.replace(' ', '_') || 'user'}_${format(new Date(), 'yyyyMMdd')}.pdf`);
}
