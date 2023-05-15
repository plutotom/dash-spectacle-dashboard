interface weather {
  today: {
    temp: { current: string; high: string; low: string };
    day: string;
    description: string;
    icon: any;
  };
  tomorrow: {
    temp: { high: string; low: string };
    day: string;
    description: string;
    icon: any;
  };
  dayAfterTomorrow: {
    temp: { high: string; low: string };
    day: string;
    description: string;
    icon: any;
  };
}

export type { weather };
