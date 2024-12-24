import { useQuery } from "react-query";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Pagination,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { kudosService } from "../services/api";
import { useUser } from "../context/UserContext";
import Layout from "../components/Layout";
import { useState } from "react";

function Dashboard() {
  const { currentUser } = useUser();
  const [page, setPage] = useState(1);
  const [likedKudos, setLikedKudos] = useState(new Set());

  const {
    data: kudosData,
    isLoading,
    error,
    refetch,
  } = useQuery(["kudos", page], () => kudosService.getAll(page), {
    keepPreviousData: true,
    retry: 2,
    initialData: { kudos: [], totalPages: 0, totalKudos: 0 },
  });

  const handleLike = async (kudoId) => {
    if (!currentUser?.name) {
      console.error("No user logged in");
      return;
    }

    try {
      await kudosService.like(kudoId, currentUser.name);
      setLikedKudos((prev) => new Set([...prev, kudoId]));
      refetch();
    } catch (error) {
      console.error("Error liking kudos:", error);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (!currentUser) {
    return (
      <Layout>
        <Alert severity="warning" sx={{ mt: 2 }}>
          Please log in to view the kudos feed.
        </Alert>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading kudos feed. Please try again later.
        </Alert>
      </Layout>
    );
  }

  // Ensure we have valid data
  const { kudos = [], totalPages = 0 } = kudosData || {};
  const validKudos = Array.isArray(kudos) ? kudos : [];

  return (
    <Layout>
      <Box sx={{ maxWidth: 1200, margin: "0 auto" }}>
        <Typography variant="h4" gutterBottom>
          Kudos Feed
        </Typography>
        {validKudos.length === 0 ? (
          <Alert severity="info">
            No kudos have been given yet. Be the first!
          </Alert>
        ) : (
          <>
            <Grid container spacing={3}>
              {validKudos.map((kudo) => (
                <Grid item xs={12} key={kudo._id}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {kudo.fromUser} gave {kudo.badge} to {kudo.toUser}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            {kudo.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(kudo.timestamp).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <IconButton
                            onClick={() => handleLike(kudo._id)}
                            disabled={likedKudos.has(kudo._id)}
                          >
                            {likedKudos.has(kudo._id) ? (
                              <Favorite color="error" />
                            ) : (
                              <FavoriteBorder />
                            )}
                          </IconButton>
                          <Typography variant="body2">
                            {kudo.likes || 0}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {totalPages > 0 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Layout>
  );
}

export default Dashboard;
