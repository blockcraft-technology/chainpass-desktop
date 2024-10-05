import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Copy, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MnemonicDisplayProps {
  mnemonic: string[];
  copied: boolean;
  handleCopyMnemonic: () => void;
  handleRegenerateMnemonic: () => void;
}

export const MnemonicDisplay: React.FC<MnemonicDisplayProps> = ({
  mnemonic,
  copied,
  handleCopyMnemonic,
  handleRegenerateMnemonic,
}) => {
  return (
    <div className="space-y-4">
      <Alert variant="default" className="bg-primary/10 border-primary/20">
        <AlertCircle className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm">
          Write down your seed phrase and store it securely.
        </AlertDescription>
      </Alert>
      <div className="grid grid-cols-3 gap-2">
        {mnemonic.map((word, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="flex items-center space-x-1 bg-muted p-2 rounded-md text-sm"
          >
            <span className="text-muted-foreground font-mono text-xs">
              {(index + 1).toString().padStart(2, '0')}
            </span>
            <span className="font-medium">{word}</span>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-between space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleCopyMnemonic} className="flex-1">
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy seed phrase to clipboard</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleRegenerateMnemonic} className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Generate a new seed phrase</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
