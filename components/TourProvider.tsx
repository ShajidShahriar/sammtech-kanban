'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Joyride, Step } from 'react-joyride';

interface TourContextType {
  startTour: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}

export function TourProvider({ children }: { children: ReactNode }) {
  const [run, setRun] = useState(false);


  const steps: Step[] = [
    {
      target: '.tour-add-column',
      content: 'Start by creating your first column! This defines the stages of your workflow.',
    },
    {
      target: '.tour-add-task',
      content: 'Once you have a column, click here to add a new task to your board.',
    },
    {
      target: '.tour-filters',
      content: 'Use these powerful filters to quickly find tasks by label, priority, or assignee.',
    },
    {
      target: '.tour-drag-drop',
      content: 'Drag and drop cards between columns to update their status. You can also reorder columns by dragging their headers.',
    }
  ];

  const startTour = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return; // Disable on mobile
    }
    setRun(true);
  };

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    const finishedStatuses: string[] = ['finished', 'skipped'];
    if (finishedStatuses.includes(status)) {
      setRun(false);
    }
  };

  return (
    <TourContext.Provider value={{ startTour }}>
      {children}
      <Joyride
        steps={steps}
        run={run}
        continuous
        onEvent={handleJoyrideCallback}
        options={{
          primaryColor: '#000',
          zIndex: 10000,
        }}
      />
    </TourContext.Provider>
  );
}
