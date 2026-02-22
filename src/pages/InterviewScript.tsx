import { useToast } from '@/hooks/use-toast';
import InterviewScriptHeader, { INTERVIEW_SCRIPT_TEXT } from './interview-script/InterviewScriptHeader';
import InterviewScriptBlocks from './interview-script/InterviewScriptBlocks';
import InterviewScriptChecklist from './interview-script/InterviewScriptChecklist';

export default function InterviewScript() {
  const { toast } = useToast();

  const handleDownload = () => {
    const blob = new Blob([INTERVIEW_SCRIPT_TEXT], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Скрипт_собеседования_ОМ.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Скрипт скачан',
      description: 'Файл сохранен на ваше устройство'
    });
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: 'Отправлено на печать',
      description: 'Документ готов к печати'
    });
  };

  const handleDownloadPdf = async () => {
    try {
      const element = document.getElementById('interview-script-content');
      if (!element) return;

      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('Скрипт_собеседования_ОМ.pdf');

      toast({
        title: 'PDF скачан',
        description: 'Файл сохранен на ваше устройство'
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать PDF',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div id="interview-script-content" className="container mx-auto px-4 py-8 sm:py-12">
        <InterviewScriptHeader
          onDownload={handleDownload}
          onDownloadPdf={handleDownloadPdf}
          onPrint={handlePrint}
        />

        <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
          <InterviewScriptBlocks />
          <InterviewScriptChecklist />
        </div>

        <div className="text-center mt-12 text-sm text-muted-foreground print:hidden">
          <p>Используйте этот скрипт как основу для собеседований</p>
          <p className="mt-1">Адаптируйте вопросы под конкретную позицию</p>
        </div>
      </div>
    </div>
  );
}
