import { useTranslation } from 'react-i18next';

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <select 
      onChange={(e) => changeLanguage(e.target.value)}
      className="bg-vasco-green text-white px-3 py-1 rounded"
    >
      <option value="es">Español</option>
      <option value="eu">Euskera</option>
      {/* ... otros idiomas */}
    </select>
  );
}