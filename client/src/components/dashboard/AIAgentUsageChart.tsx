import React, { useState } from 'react';
import { BrutalistCard } from '../ui/brutalist-card';
import { BrutalistButton } from '../ui/brutalist-button';

interface AIAgentUsageChartProps {
  title: string;
}

// Generate random monthly data for AI agent usage (simplified)
const generateMonthlyData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  // Show only the last 6 months
  const displayMonths = [...months.slice(currentMonth - 5, currentMonth + 1)];
  if (displayMonths.length < 6) {
    // If we're in the early months of the year, add months from previous year
    displayMonths.unshift(...months.slice(-(6 - displayMonths.length)));
  }
  
  // Generate random data for each agent type (simplified)
  const agentTypes = ['Analysis', 'Trading', 'Research'];
  const data = agentTypes.map(type => ({
    name: type,
    color: type === 'Analysis' ? '#8B5CF6' : type === 'Trading' ? '#3B82F6' : '#EC4899',
    values: displayMonths.map(() => Math.floor(Math.random() * 40) + 5) // Random values between 5-45
  }));
  
  return { months: displayMonths, data };
};

const AIAgentUsageChart: React.FC<AIAgentUsageChartProps> = ({ title }) => {
  const [chartData] = useState(generateMonthlyData());
  const [chartType, setChartType] = useState<'stacked' | 'grouped'>('stacked');
  
  // Find the maximum value for scaling (simplified)
  const maxValue = Math.max(
    ...chartData.data.map(series => 
      chartType === 'stacked' 
        ? chartData.months.map((_, i) => chartData.data.reduce((sum, s) => sum + s.values[i], 0))
        : series.values
    ).flat()
  );
  
  // Calculate bar width based on chart type
  const barWidth = chartType === 'stacked' ? 60 : 18;
  const groupSpacing = chartType === 'stacked' ? 80 : 100;
  
  // Calculate total agent uses
  const totalAgentUses = chartData.data.reduce(
    (sum, series) => sum + series.values.reduce((s, v) => s + v, 0), 
    0
  );
  
  // Calculate daily average
  const dailyAverage = Math.round(totalAgentUses / (6 * 30));
  
  return (
    <BrutalistCard>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-mono font-bold text-xl">{title}</h2>
          <p className="text-gray-600 mt-1">
            Average {dailyAverage} agents used per day
          </p>
        </div>
        <div className="flex space-x-2">
          <BrutalistButton
            className="py-1 px-3 text-sm font-bold"
            color={chartType === 'stacked' ? 'purple' : 'default'}
            onClick={() => setChartType('stacked')}
          >
            Combined
          </BrutalistButton>
          <BrutalistButton
            className="py-1 px-3 text-sm font-bold"
            color={chartType === 'grouped' ? 'purple' : 'default'}
            onClick={() => setChartType('grouped')}
          >
            Separate
          </BrutalistButton>
        </div>
      </div>
      
      <div className="h-64 overflow-x-auto">
        <svg width="100%" height="100%" viewBox={`0 0 ${Math.max(800, chartData.months.length * groupSpacing + 100)} 300`} preserveAspectRatio="none">
          {/* Y-axis and grid lines */}
          <line x1="60" y1="20" x2="60" y2="280" stroke="#333" strokeWidth="2"/>
          <line x1="60" y1="280" x2={chartData.months.length * groupSpacing + 60} y2="280" stroke="#333" strokeWidth="2"/>
          
          {/* Y-axis labels and grid lines (simplified) */}
          {[0, 20, 40, 60, 80, 100].map((value, i) => (
            <React.Fragment key={i}>
              <text x="50" y={280 - (value / 100) * 240} textAnchor="end" fontSize="12" fill="#666" fontWeight="bold">
                {value}
              </text>
              <line 
                x1="60" 
                y1={280 - (value / 100) * 240} 
                x2={chartData.months.length * groupSpacing + 60} 
                y2={280 - (value / 100) * 240} 
                stroke="#333" 
                strokeWidth="1" 
                strokeDasharray={value > 0 ? "4,4" : ""}
              />
            </React.Fragment>
          ))}
          
          {/* X-axis labels */}
          {chartData.months.map((month, i) => (
            <text 
              key={i} 
              x={i * groupSpacing + 60 + (chartType === 'stacked' ? barWidth/2 : groupSpacing/2)} 
              y="295" 
              textAnchor="middle" 
              fontSize="13" 
              fontWeight="bold"
              fill="#333"
            >
              {month}
            </text>
          ))}
          
          {/* Bars */}
          {chartData.months.map((month, monthIndex) => (
            <g key={monthIndex}>
              {chartData.data.map((series, seriesIndex) => {
                const value = series.values[monthIndex];
                const normalizedValue = (value / maxValue) * 240;
                
                let x, y, height;
                
                if (chartType === 'stacked') {
                  // Calculate the sum of all previous series for this month
                  const previousValues = chartData.data
                    .slice(0, seriesIndex)
                    .reduce((sum, s) => sum + s.values[monthIndex], 0);
                  const previousHeight = (previousValues / maxValue) * 240;
                  
                  x = monthIndex * groupSpacing + 60;
                  y = 280 - previousHeight - normalizedValue;
                  height = normalizedValue;
                } else {
                  // Grouped bars
                  x = monthIndex * groupSpacing + 60 + seriesIndex * barWidth;
                  y = 280 - normalizedValue;
                  height = normalizedValue;
                }
                
                return (
                  <g key={`${monthIndex}-${seriesIndex}`}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={height}
                      fill={series.color}
                      stroke="#000"
                      strokeWidth="2"
                    />
                    {height > 30 && chartType === 'stacked' && (
                      <text
                        x={x + barWidth/2}
                        y={y + height/2 + 5}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="bold"
                        fill="white"
                      >
                        {value}
                      </text>
                    )}
                    {chartType === 'grouped' && (
                      <text
                        x={x + barWidth/2}
                        y={y - 5}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="bold"
                        fill="#333"
                      >
                        {value}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          ))}
          
          {/* Legend */}
          <g transform="translate(60, 20)">
            {chartData.data.map((series, i) => (
              <g key={i} transform={`translate(${i * 100}, 0)`}>
                <rect width="16" height="16" fill={series.color} stroke="#000" strokeWidth="1" />
                <text x="24" y="12" fontSize="12" fontWeight="bold">{series.name} Agents</text>
              </g>
            ))}
          </g>
        </svg>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 text-center">
        <p className="text-gray-700 font-medium">
          Total {totalAgentUses} AI agent uses in the past 6 months
        </p>
      </div>
    </BrutalistCard>
  );
};

export default AIAgentUsageChart; 