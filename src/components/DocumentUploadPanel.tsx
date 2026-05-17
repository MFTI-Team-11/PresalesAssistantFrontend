import { FileText, UploadCloud } from 'lucide-react';
import { SectionTitle } from './SectionTitle';

export function DocumentUploadPanel() {
  return (
    <article className="panel wide upload-panel">
      <SectionTitle icon={<FileText />} title="Входные материалы" />
      <div className="dropzone">
        <UploadCloud size={28} />
        <div>
          <strong>Бизнес-требования, таблицы, вложенные файлы</strong>
          <span>PDF, DOCX, XLSX, TXT. Данные остаются внутри on-prem контура.</span>
        </div>
      </div>
      <div className="document-list">
        <Document name="BRD_customer_portal.docx" status="ФТ извлечены" />
        <Document name="integration_map.xlsx" status="Интеграции распознаны" />
        <Document name="rates_template.xlsx" status="Ставки применены" />
      </div>
    </article>
  );
}

function Document({ name, status }: { name: string; status: string }) {
  return (
    <div className="document">
      <FileText size={18} />
      <span>{name}</span>
      <strong>{status}</strong>
    </div>
  );
}
