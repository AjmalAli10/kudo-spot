import { useState, useEffect, useCallback, memo } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { userService, kudosService, badgeService } from "../services/api";
import { useUser } from "../context/UserContext";
import Layout from "../components/Layout";

// Memoized form components
const KudosForm = memo(
  ({ formData, onSubmit, onChange, users, badges, isSubmitting }) => (
    <Box component="form" onSubmit={onSubmit}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Recipient</InputLabel>
        <Select
          name="toUser"
          value={formData.toUser}
          onChange={onChange}
          required
          label="Recipient"
          disabled={users.length === 0}
        >
          {users.map((user) => (
            <MenuItem key={user._id || user.name} value={user.name}>
              {user.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Badge</InputLabel>
        <Select
          name="badge"
          value={formData.badge}
          onChange={onChange}
          required
          label="Badge"
          disabled={badges.length === 0}
        >
          {badges.map((badge) => (
            <MenuItem key={badge._id || badge.name} value={badge.name}>
              {badge.name} - {badge.description || ""}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        multiline
        rows={4}
        name="message"
        label="Message"
        value={formData.message}
        onChange={onChange}
        required
        sx={{ mb: 2 }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={isSubmitting || users.length === 0 || badges.length === 0}
      >
        {isSubmitting ? "Sending..." : "Give Kudos"}
      </Button>
    </Box>
  )
);

KudosForm.displayName = "KudosForm";

function GiveKudos() {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    toUser: "",
    badge: "",
    message: "",
  });

  // Initialize badges on component mount
  useEffect(() => {
    const initBadges = async () => {
      try {
        await badgeService.initialize();
        queryClient.invalidateQueries("badges");
      } catch (error) {
        console.error("Error initializing badges:", error);
      }
    };
    initBadges();
  }, [queryClient]);

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError,
  } = useQuery("users", userService.getAllUsers, {
    staleTime: 30000,
  });

  const {
    data: badgesData,
    isLoading: isLoadingBadges,
    error: badgesError,
  } = useQuery("badges", badgeService.getAll, {
    staleTime: 30000,
  });

  const createKudosMutation = useMutation(
    (kudosData) => kudosService.create(kudosData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("kudos");
        navigate("/dashboard");
      },
    }
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      createKudosMutation.mutate({
        ...formData,
        fromUser: currentUser.name,
      });
    },
    [formData, currentUser.name, createKudosMutation]
  );

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  if (!currentUser) {
    return (
      <Layout>
        <Alert severity="warning">Please log in to give kudos.</Alert>
      </Layout>
    );
  }

  if (isLoadingUsers || isLoadingBadges) {
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

  // Ensure we have arrays to work with
  const users = Array.isArray(usersData) ? usersData : [];
  const badges = Array.isArray(badgesData) ? badgesData : [];
  const filteredUsers = users.filter(
    (user) => user?.name !== currentUser?.name
  );

  return (
    <Layout>
      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          mt: 4,
        }}
      >
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Give Kudos
          </Typography>

          {(usersError || badgesError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Error loading data: {usersError?.message || badgesError?.message}
            </Alert>
          )}

          {createKudosMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to send kudos. Please try again.
            </Alert>
          )}

          {filteredUsers.length === 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              No other users available to give kudos to.
            </Alert>
          )}

          <KudosForm
            formData={formData}
            onSubmit={handleSubmit}
            onChange={handleChange}
            users={filteredUsers}
            badges={badges}
            isSubmitting={createKudosMutation.isLoading}
          />
        </Paper>
      </Box>
    </Layout>
  );
}

export default GiveKudos;
