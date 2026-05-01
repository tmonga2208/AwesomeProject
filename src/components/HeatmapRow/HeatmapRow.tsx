import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Svg, { Rect, G, Text as SvgText } from 'react-native-svg';
import { subDays, format, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth } from 'date-fns';
import { theme } from '@/theme';

interface HeatmapData {
  date: string; // 'yyyy-MM-dd'
  count: number;
}

interface HeatmapRowProps {
  data: HeatmapData[];
  weeks?: number;
  cellSize?: number;
  cellSpacing?: number;
  baseColor?: string; // e.g. '#4E6351'
}

const HeatmapRow: React.FC<HeatmapRowProps> = ({
  data,
  weeks = 12,
  cellSize = 12,
  cellSpacing = 4,
  baseColor = '#7D927D',
}) => {
  const { width } = Dimensions.get('window');
  const daysInWeek = 7;
  const totalDays = weeks * daysInWeek;

  const { grid, monthLabels } = useMemo(() => {
    const today = new Date();
    // We want the grid to end at the end of the current week
    const end = endOfWeek(today);
    const start = subDays(end, totalDays - 1);
    
    const days = eachDayOfInterval({ start, end });
    const dataMap = new Map(data.map((d) => [d.date, d.count]));

    const gridLayout = [];
    const labels = [];
    let currentMonth = '';

    // Group days into columns (weeks)
    for (let w = 0; w < weeks; w++) {
      const col = [];
      const colStartDay = days[w * daysInWeek];
      if (!colStartDay) break;

      const monthName = format(colStartDay, 'MMM');
      if (monthName !== currentMonth) {
        labels.push({ label: monthName, colIndex: w });
        currentMonth = monthName;
      }

      for (let d = 0; d < daysInWeek; d++) {
        const day = days[w * daysInWeek + d];
        if (!day) break;

        const dateStr = format(day, 'yyyy-MM-dd');
        const count = dataMap.get(dateStr) || 0;
        
        let opacity = 0.1; // Default empty state
        if (count > 0) {
          opacity = Math.min(0.2 + count * 0.2, 1); // 1-4+ count scales opacity to 1
        }

        col.push({
          date: dateStr,
          opacity,
        });
      }
      gridLayout.push(col);
    }
    return { grid: gridLayout, monthLabels: labels };
  }, [data, weeks, totalDays]);

  const svgWidth = weeks * (cellSize + cellSpacing) + 30; // 30px padding for y-axis labels
  const svgHeight = daysInWeek * (cellSize + cellSpacing) + 20; // 20px padding for x-axis labels

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
      <Svg width={svgWidth} height={svgHeight}>
        {/* X-axis (Months) */}
        {monthLabels.map((m, idx) => (
          <SvgText
            key={idx}
            x={30 + m.colIndex * (cellSize + cellSpacing)}
            y={12}
            fontSize={10}
            fill={theme.colors.outline}
            fontFamily={theme.typography.fonts.primary}
          >
            {m.label}
          </SvgText>
        ))}

        {/* Y-axis (Days) - simplified to just Mon, Wed, Fri */}
        <SvgText x={0} y={20 + 1 * (cellSize + cellSpacing) + cellSize / 2} fontSize={10} fill={theme.colors.outline}>
          Mon
        </SvgText>
        <SvgText x={0} y={20 + 3 * (cellSize + cellSpacing) + cellSize / 2} fontSize={10} fill={theme.colors.outline}>
          Wed
        </SvgText>
        <SvgText x={0} y={20 + 5 * (cellSize + cellSpacing) + cellSize / 2} fontSize={10} fill={theme.colors.outline}>
          Fri
        </SvgText>

        <G x={30} y={20}>
          {grid.map((col, colIdx) => (
            <G key={colIdx} x={colIdx * (cellSize + cellSpacing)}>
              {col.map((cell, rowIdx) => (
                <Rect
                  key={cell.date}
                  y={rowIdx * (cellSize + cellSpacing)}
                  width={cellSize}
                  height={cellSize}
                  rx={4} // rounded corners
                  fill={baseColor}
                  fillOpacity={cell.opacity}
                />
              ))}
            </G>
          ))}
        </G>
      </Svg>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingRight: 16,
  },
});

export default HeatmapRow;
