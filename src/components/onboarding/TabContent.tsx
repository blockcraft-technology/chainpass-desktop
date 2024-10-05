import { Tabs, TabsContent as TabContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatePresence, motion } from 'framer-motion';
import { Key, Import } from 'lucide-react';

interface TabsContentProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  children: React.ReactNode;
}

export const TabsContent: React.FC<TabsContentProps> = ({ activeTab, setActiveTab, children }) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="create">
          <Key className="w-4 h-4 mr-2" />
          Create
        </TabsTrigger>
        <TabsTrigger value="import">
          <Import className="w-4 h-4 mr-2" />
          Import
        </TabsTrigger>
      </TabsList>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <TabContent value={activeTab}>{children}</TabContent>
        </motion.div>
      </AnimatePresence>
    </Tabs>
  );
};
