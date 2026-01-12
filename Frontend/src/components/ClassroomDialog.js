import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ClassroomDialog({
  open,
  onClose,
  seating = [],
  capacity = 20,
  staff = "",
  room = ""
}) {
  const ROWS = 5;
  const COLS = 4;

  const filledSeats = [...seating];
  while (filledSeats.length < capacity) filledSeats.push(null);

  /* TOP → BOTTOM FILL */
  const getSeat = (row, col) => {
    const index = col * ROWS + row;
    return filledSeats[index] || null;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ position: "relative" }}>
        Classroom Visual

        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* 🔥 HEADER INFO */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3
          }}
        >
          {/* ROOM */}
          <Box
            sx={{
              px: 2,
              py: 1,
              borderRadius: 1,
              bgcolor: "#e3f2fd",
              fontWeight: 600
            }}
          >
            Room : {room}
          </Box>

          {/* INVIGILATOR */}
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 16,
              color: "#2e7d32"
            }}
          >
            Invigilator : {staff}
          </Typography>
        </Box>

        {/* 🪑 CLASSROOM GRID */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gap: 2,
            justifyItems: "center"
          }}
        >
          {[...Array(COLS)].map((_, col) => (
            <Box
              key={col}
              sx={{
                display: "grid",
                gridTemplateRows: `repeat(${ROWS}, 1fr)`,
                gap: 2
              }}
            >
              {[...Array(ROWS)].map((_, row) => {
                const seat = getSeat(row, col);

                return (
                  <Box
                    key={row}
                    sx={{
                      width: 95,
                      height: 60,
                      border: "1.5px solid #1976d2",
                      borderRadius: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: seat ? "#e3f2fd" : "#fafafa"
                    }}
                  >
                    {seat ? (
                      <>
                        <Typography fontSize={12} fontWeight="bold">
                          {seat.student_name}
                        </Typography>
                        <Typography fontSize={11} color="text.secondary">
                          {seat.register_no}
                        </Typography>
                      </>
                    ) : (
                      <Typography fontSize={16} color="error">
                        ❌
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
