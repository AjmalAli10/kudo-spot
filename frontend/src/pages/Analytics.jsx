import { useQuery } from "react-query";
import {
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { analyticsService } from "../services/api";
import Layout from "../components/Layout";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Analytics() {
  const { data: kudosByBadge = [] } = useQuery(
    "kudosByBadge",
    analyticsService.getKudosByBadge
  );
  const { data: leaderboard = [] } = useQuery(
    "leaderboard",
    analyticsService.getLeaderboard
  );
  const { data: mostLiked = [] } = useQuery(
    "mostLiked",
    analyticsService.getMostLiked
  );

  const chartData = {
    labels: kudosByBadge.map((item) => item._id) || [],
    datasets: [
      {
        label: "Kudos Given",
        data: kudosByBadge.map((item) => item.count) || [],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Kudos by Badge Type",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <Layout>
      <Grid container spacing={3}>
        {/* Badge Distribution Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Bar data={chartData} options={chartOptions} />
          </Paper>
        </Grid>

        {/* Leaderboard */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Leaderboard
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Kudos Received</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaderboard.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell align="right">{user.kudosReceived}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Most Liked Kudos */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Most Liked Kudos
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>From</TableCell>
                    <TableCell>To</TableCell>
                    <TableCell>Badge</TableCell>
                    <TableCell align="right">Likes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mostLiked.map((kudo) => (
                    <TableRow key={kudo._id}>
                      <TableCell>{kudo.fromUser}</TableCell>
                      <TableCell>{kudo.toUser}</TableCell>
                      <TableCell>{kudo.badge}</TableCell>
                      <TableCell align="right">{kudo.likes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default Analytics;
