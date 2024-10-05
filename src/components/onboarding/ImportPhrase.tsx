import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImportPhraseProps {
  importedPhrase: string[];
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  handleImportedPhraseChange: (index: number, value: string) => void;
  importProgress: number;
}

export const ImportPhrase: React.FC<ImportPhraseProps> = ({
  importedPhrase,
  inputRefs,
  handleImportedPhraseChange,
  importProgress,
}) => {
  return (
    <div className="space-y-4">
      <Alert variant="default" className="bg-primary/10 border-primary/20">
        <AlertCircle className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm">
          Enter your 12-word seed phrase to import your wallet.
        </AlertDescription>
      </Alert>
      <div className="grid grid-cols-3 gap-2">
        {importedPhrase.map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="flex items-center space-x-1"
          >
            <Input
              ref={(el) => (inputRefs.current[index] = el)}
              value={importedPhrase[index]}
              onChange={(e) => handleImportedPhraseChange(index, e.target.value)}
              className="text-sm p-2"
              placeholder={`Word ${index + 1}`}
              onPaste={(e) => handleImportedPhraseChange(index, e.clipboardData.getData('text'))}
            />
          </motion.div>
        ))}
      </div>
      <Progress value={importProgress} className="w-full" />
    </div>
  );
};
