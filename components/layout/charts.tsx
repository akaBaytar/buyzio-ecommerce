'use client';

import { ResponsiveContainer, Bar, BarChart, XAxis, YAxis } from 'recharts';

type ChartsTypes = {
  data: { sales: { month: string; totalSales: number }[] };
};

const Charts = ({ data: { sales } }: ChartsTypes) => {
  return (
    <ResponsiveContainer width='100%' height={238}>
      <BarChart data={sales}>
        <XAxis dataKey='month' tickLine={false} axisLine={false} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey='totalSales'
          fill='currentColor'
          radius={[8, 8, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Charts;
