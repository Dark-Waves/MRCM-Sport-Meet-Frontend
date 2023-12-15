import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

export default function Houses({ houseData }) {
  const calculateFirst = function () {};

  return (
    <div className="main__Houses m-t-5">
      <h2 className="title font-xl font-weight-700 m-b-4">Houses</h2>
      <Grid container spacing={3} className="grid-houses">
        {houseData.map((data, index) => (
          <Grid item xs={11} sm={5} md={3} key={index}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography
                  sx={{
                    fontSize: 25,
                    fontWeight: 700,
                    fontFamily: "Bai Jamjuree",
                  }}
                  color="text.primary"
                >
                  {data.Name} - {data.houseScore}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {data.description}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  <Typography color="text.secondary">
                    Members: {data.members.length}{" "}
                  </Typography>
                  <Typography color="text.secondary">
                    eventData: {data.members.length}
                  </Typography>
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
