// types/react-date-range.d.ts
declare module 'react-date-range' {
    import * as React from 'react';
    export interface Range {
      startDate: Date;
      endDate: Date;
      key: string;
    }
    export interface DateRangeProps {
      ranges: Range[];
      onChange: (ranges: { [key: string]: Range }) => void;
      minDate?: Date;
      maxDate?: Date;
      rangeColors?: string[];
      [key: string]: any;
    }
    export class DateRange extends React.Component<DateRangeProps> {}
  }
  