
import { AttendanceRecord } from "@/contexts/AttendanceContext";
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  ResponsiveContainer, 
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  CartesianGrid,
} from "recharts";

interface AttendanceChartProps {
  type: "bar" | "pie" | "line";
  data: AttendanceRecord[];
}

const AttendanceChart = ({ type, data }: AttendanceChartProps) => {
  // Colors for the charts
  const colors = {
    approved: "#10B981",
    rejected: "#EF4444",
    pending: "#6E59A5",
    halfDay: "#F59E0B",
  };

  // Process data for pie chart
  const preparePieData = () => {
    const statusCounts = data.reduce(
      (acc, record) => {
        if (record.status === "approved") acc.present += 1;
        else if (record.status === "rejected") acc.absent += 1;
        else if (record.status === "half-day") acc.halfDay += 1;
        else if (record.status === "pending") acc.pending += 1;
        return acc;
      },
      { present: 0, absent: 0, halfDay: 0, pending: 0 }
    );

    return [
      { name: "Present", value: statusCounts.present, color: colors.approved },
      { name: "Absent", value: statusCounts.absent, color: colors.rejected },
      { name: "Half-day", value: statusCounts.halfDay, color: colors.halfDay },
      { name: "Pending", value: statusCounts.pending, color: colors.pending },
    ];
  };

  // Process data for bar chart (last 7 days)
  const prepareBarData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayRecords = data.filter(record => record.date === date);
      const present = dayRecords.filter(r => r.status === "approved").length;
      const absent = dayRecords.filter(r => r.status === "rejected").length;
      const halfDay = dayRecords.filter(r => r.status === "half-day").length;
      const pending = dayRecords.filter(r => r.status === "pending").length;
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        Present: present,
        Absent: absent,
        "Half-day": halfDay,
        Pending: pending,
      };
    });
  };

  // Process data for line chart
  const prepareLineData = () => {
    // Similar to bar data but could be modified for different time periods
    return prepareBarData();
  };

  if (type === "pie") {
    const pieData = preparePieData();
    return (
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => 
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </RechartsPieChart>
      </ResponsiveContainer>
    );
  } else if (type === "bar") {
    const barData = prepareBarData();
    return (
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={barData}>
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Present" fill={colors.approved} />
          <Bar dataKey="Absent" fill={colors.rejected} />
          <Bar dataKey="Half-day" fill={colors.halfDay} />
          <Bar dataKey="Pending" fill={colors.pending} />
        </RechartsBarChart>
      </ResponsiveContainer>
    );
  } else {
    // Line chart
    const lineData = prepareLineData();
    return (
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Present" stroke={colors.approved} />
          <Line type="monotone" dataKey="Absent" stroke={colors.rejected} />
          <Line type="monotone" dataKey="Half-day" stroke={colors.halfDay} />
          <Line type="monotone" dataKey="Pending" stroke={colors.pending} />
        </RechartsLineChart>
      </ResponsiveContainer>
    );
  }
};

export default AttendanceChart;
