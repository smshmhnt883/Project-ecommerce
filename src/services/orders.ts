import { OrderStage, TrackingStep } from '@/types';

// Helper to generate the 7-stage Indian logistics timeline
export function generateTrackingTimeline(
  currentStage: OrderStage,
  orderDateIso?: string
): TrackingStep[] {
  const baseTime = orderDateIso ? new Date(orderDateIso).getTime() : Date.now();

  const stages: { stage: OrderStage; title: string; description: string; hoursOffset: number }[] = [
    {
      stage: 'placed',
      title: 'Order Received & Verified',
      description: 'Order details verified with authentic Patanjali Ayurvedic dispatch center.',
      hoursOffset: 0,
    },
    {
      stage: 'payment_confirmed',
      title: 'Payment Pending / Demo Verification',
      description: 'Demo checkout completed; payment confirmation will be enabled upon gateway integration.',
      hoursOffset: 0.1,
    },
    {
      stage: 'processing',
      title: 'Formulation Selected & Quality Inspection',
      description: 'Herbal batches hand-selected from Haridwar Ayurvedic packaging facility.',
      hoursOffset: 4,
    },
    {
      stage: 'packed',
      title: 'Eco-Friendly Tamper-Proof Packaging',
      description: 'Packed securely with certified Ayurvedic quality seals and tracking barcodes.',
      hoursOffset: 12,
    },
    {
      stage: 'shipped',
      title: 'Dispatched via Express Logistics',
      description: 'Consignment handed to logistics partner. Airway Bill generated.',
      hoursOffset: 24,
    },
    {
      stage: 'out_for_delivery',
      title: 'Out for Final Mile Delivery',
      description: 'Delivery associate assigned for doorstep drop-off with contactless OTP verification.',
      hoursOffset: 72,
    },
    {
      stage: 'delivered',
      title: 'Package Safely Delivered',
      description: 'Handed over at customer address. Authentic Patanjali seal verified upon receipt.',
      hoursOffset: 96,
    },
  ];

  const stageOrder: OrderStage[] = [
    'placed',
    'payment_confirmed',
    'processing',
    'packed',
    'shipped',
    'out_for_delivery',
    'delivered',
  ];

  const currentIdx = stageOrder.indexOf(currentStage);

  return stages.map((step, idx) => {
    const isCompleted = idx <= currentIdx;
    const isCurrent = idx === currentIdx;
    const stepTime = new Date(baseTime + step.hoursOffset * 3600 * 1000);

    const formattedTime = stepTime.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      stage: step.stage,
      title: step.title,
      description: step.description,
      timestamp: formattedTime,
      completed: isCompleted,
      current: isCurrent,
    };
  });
}
